-- Supabase PostgreSQL Schema for afus multi-vendor COD marketplace

-- Create custom enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE amana_delivery_status AS ENUM ('pending_collection', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'returned_to_sender');
CREATE TYPE notification_category AS ENUM ('order_update', 'new_message', 'system_alert');

-- 1. PROFILES Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'buyer',
    phone_number TEXT NOT NULL, -- Mandatory for Moroccan COD confirmation codes
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profiles" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. SHOPS Table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    description_translations JSONB NOT NULL DEFAULT '{}'::jsonb, -- translations for ar, fr, en
    store_policy_translations JSONB NOT NULL DEFAULT '{}'::jsonb, -- return/refund rules
    faq_translations JSONB NOT NULL DEFAULT '[]'::jsonb, -- nested question/answer array
    merchant_city TEXT NOT NULL, -- origin hub for delivery matrix calculation (e.g. 'Casablanca', 'Marrakech', 'Fes')
    pickup_address_street TEXT NOT NULL, -- physical warehouse location for Amana courier collections
    ice_number CHAR(15) NOT NULL CHECK (length(ice_number) = 15), -- 15-digit Moroccan corporate registration check
    is_verified BOOLEAN DEFAULT false,
    is_vacation_mode BOOLEAN DEFAULT false,
    average_rating NUMERIC(3,2) DEFAULT 0.00,
    completed_orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indices on shops slug and merchant_city
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_merchant_city ON shops(merchant_city);

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to shops" ON shops
    FOR SELECT USING (true);

CREATE POLICY "Allow shop owners to manage their shop" ON shops
    FOR ALL USING (auth.uid() = owner_id);

-- 3. CATEGORIES Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    name_translations JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- 4. PRODUCTS Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    numeric_id BIGSERIAL UNIQUE NOT NULL, -- unique index scanner, replicated slug logic like Etsy
    slug_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    description_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    base_price_mad NUMERIC(10,2) NOT NULL,
    media_gallery TEXT[] NOT NULL DEFAULT '{}'::text[],
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- GIN index tracking search vectors across translations
CREATE INDEX idx_products_title_translations_gin ON products USING gin(title_translations);
CREATE INDEX idx_products_description_translations_gin ON products USING gin(description_translations);
CREATE INDEX idx_products_numeric_id ON products(numeric_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow shop owners to manage their products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- 5. PRODUCT VARIANTS Table
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    price_override_mad NUMERIC(10,2), -- NULL if same as product base price
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb -- e.g. {"fr": {"taille": "m", "couleur": "rouge"}, "en": {"size": "m", "color": "red"}}
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to product variants" ON product_variants
    FOR SELECT USING (true);

CREATE POLICY "Allow shop owners to manage variants" ON product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM products
            JOIN shops ON shops.id = products.shop_id
            WHERE products.id = product_variants.product_id AND shops.owner_id = auth.uid()
        )
    );

-- 6. ORDERS & ORDER ITEMS Tables
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    subtotal_mad NUMERIC(10,2) NOT NULL,
    shipping_cost_mad NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_mad NUMERIC(10,2) NOT NULL,
    order_status order_status NOT NULL DEFAULT 'pending',
    amana_delivery_status amana_delivery_status NOT NULL DEFAULT 'pending_collection',
    amana_tracking_number TEXT UNIQUE, -- format e.g. AM123456789MA
    amana_history JSONB NOT NULL DEFAULT '[]'::jsonb, -- time-stamped location tracking logs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_mad NUMERIC(10,2) NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(order_status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Buyers can read their own orders; sellers can read orders from their shop
CREATE POLICY "Allow buyers to read their own orders" ON orders
    FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Allow sellers to read/update their shop orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM shops 
            WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid()
        )
    );

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow order items read access" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id AND (
                orders.buyer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM shops 
                    WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid()
                )
            )
        )
    );

-- 7. CHAT ROOMS & CHAT MESSAGES
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(shop_id, buyer_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    message TEXT NOT NULL,
    product_context JSONB DEFAULT NULL, -- optional snapshot {"product_id": "...", "title": "...", "price": 120}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_chat_rooms_lookup ON chat_rooms(shop_id, buyer_id);
CREATE INDEX idx_chat_messages_room_created ON chat_messages(room_id, created_at DESC);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow room participants to select chat room" ON chat_rooms
    FOR SELECT USING (
        buyer_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM shops 
            WHERE shops.id = chat_rooms.shop_id AND shops.owner_id = auth.uid()
        )
    );

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow room participants to manage messages" ON chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE chat_rooms.id = chat_messages.room_id AND (
                chat_rooms.buyer_id = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM shops 
                    WHERE shops.id = chat_rooms.shop_id AND shops.owner_id = auth.uid()
                )
            )
        )
    );

-- 8. NOTIFICATIONS Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category notification_category NOT NULL,
    slug_route TEXT NOT NULL, -- deep link path, e.g. /en/dashboard/orders
    message_translations JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"en": "...", "fr": "...", "ar": "..."}
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Multi-column index optimizing fast unread lookups
CREATE INDEX idx_notifications_unread_lookup ON notifications(recipient_id, is_read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own notifications" ON notifications
    FOR ALL USING (recipient_id = auth.uid());


-- AMANA SHIPPING COST CALCULATOR FUNCTION
-- Standard rates for Amana shipping in Morocco:
-- Intra-city: 35 MAD, Inter-city: 45 MAD. Rural/Remote: 55 MAD.
CREATE OR REPLACE FUNCTION calculate_amana_shipping(origin TEXT, destination TEXT)
RETURNS NUMERIC AS $$
DECLARE
    clean_origin TEXT;
    clean_destination TEXT;
BEGIN
    clean_origin := LOWER(TRIM(origin));
    clean_destination := LOWER(TRIM(destination));
    
    IF clean_origin = clean_destination THEN
        RETURN 35.00;
    ELSIF clean_destination IN ('casablanca', 'rabat', 'marrakech', 'tangier', 'fes', 'agadir', 'oujda', 'meknes', 'kenitra', 'tetouan') THEN
        RETURN 45.00;
    ELSE
        -- Rural or smaller locations
        RETURN 55.00;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- STORED PROCEDURE FOR MULTI-SHOP ORDER SPLITTING
-- This handles checkout requests where orders are split by unique shop_id
CREATE OR REPLACE FUNCTION place_cod_checkout(
    p_buyer_id UUID,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_shipping_city TEXT,
    p_shipping_address TEXT,
    p_items JSONB -- Array of {"product_id": "...", "variant_id": "...", "quantity": 1}
)
RETURNS JSONB AS $$
DECLARE
    v_item RECORD;
    v_shop_id UUID;
    v_product_price NUMERIC;
    v_variant_price NUMERIC;
    v_final_item_price NUMERIC;
    v_item_subtotal NUMERIC;
    v_shop_subtotals JSONB := '{}'::jsonb;
    v_shop_items JSONB := '{}'::jsonb;
    v_created_orders JSONB := '[]'::jsonb;
    v_shop_rec RECORD;
    v_order_id UUID;
    v_tracking_number TEXT;
    v_shipping_cost NUMERIC;
    v_total_mad NUMERIC;
    v_initial_history JSONB;
BEGIN
    -- Step 1: Pre-process and group items by shop
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INT) LOOP
        -- Retrieve the product's shop and price
        SELECT shop_id, base_price_mad INTO v_shop_id, v_product_price 
        FROM products WHERE id = v_item.product_id;
        
        IF v_shop_id IS NULL THEN
            RAISE EXCEPTION 'Product with ID % not found', v_item.product_id;
        END IF;

        -- Check variant price override if variant is selected
        IF v_item.variant_id IS NOT NULL THEN
            SELECT price_override_mad INTO v_variant_price 
            FROM product_variants 
            WHERE id = v_item.variant_id AND product_id = v_item.product_id;
            
            v_final_item_price := COALESCE(v_variant_price, v_product_price);
        ELSE
            v_final_item_price := v_product_price;
        END IF;

        v_item_subtotal := v_final_item_price * v_item.quantity;

        -- Accumulate subtotal for the shop
        IF v_shop_subtotals ? v_shop_id::TEXT THEN
            v_shop_subtotals := jsonb_set(
                v_shop_subtotals, 
                ARRAY[v_shop_id::TEXT], 
                to_jsonb( (v_shop_subtotals->>v_shop_id::TEXT)::NUMERIC + v_item_subtotal )
            );
        ELSE
            v_shop_subtotals := jsonb_set(v_shop_subtotals, ARRAY[v_shop_id::TEXT], to_jsonb(v_item_subtotal));
        END IF;

        -- Append item details to shop array
        IF NOT (v_shop_items ? v_shop_id::TEXT) THEN
            v_shop_items := jsonb_set(v_shop_items, ARRAY[v_shop_id::TEXT], '[]'::jsonb);
        END IF;
        
        v_shop_items := jsonb_set(
            v_shop_items, 
            ARRAY[v_shop_id::TEXT, jsonb_array_length(v_shop_items->v_shop_id::TEXT)::TEXT], 
            jsonb_build_object(
                'product_id', v_item.product_id,
                'variant_id', v_item.variant_id,
                'quantity', v_item.quantity,
                'price_mad', v_final_item_price
            ),
            true
        );
    END LOOP;

    -- Step 2: Create separate orders per shop
    FOR v_shop_id IN SELECT DISTINCT (key)::UUID FROM jsonb_each(v_shop_subtotals) LOOP
        -- Retrieve shop info
        SELECT merchant_city INTO v_shop_rec FROM shops WHERE id = v_shop_id;
        
        -- Calculate shipping cost using Barid Bank Amana matrix
        v_shipping_cost := calculate_amana_shipping(v_shop_rec.merchant_city, p_shipping_city);
        
        v_item_subtotal := (v_shop_subtotals->>v_shop_id::TEXT)::NUMERIC;
        v_total_mad := v_item_subtotal + v_shipping_cost;

        -- Generate AMANA tracking number mock: AM + 9 digits + MA
        v_tracking_number := 'AM' || lpad(floor(random() * 1000000000)::TEXT, 9, '0') || 'MA';

        -- Set initial Amana tracking logs
        v_initial_history := jsonb_build_array(
            jsonb_build_object(
                'status', 'pending_collection',
                'timestamp', TIMEZONE('utc'::text, NOW())::TEXT,
                'location', v_shop_rec.merchant_city,
                'note', 'Order placed, awaiting Amana pickup'
            )
        );

        -- Insert the split order record
        INSERT INTO orders (
            shop_id, buyer_id, customer_name, customer_phone, shipping_city, shipping_address,
            subtotal_mad, shipping_cost_mad, total_mad, order_status, amana_delivery_status,
            amana_tracking_number, amana_history
        ) VALUES (
            v_shop_id, p_buyer_id, p_customer_name, p_customer_phone, p_shipping_city, p_shipping_address,
            v_item_subtotal, v_shipping_cost, v_total_mad, 'pending', 'pending_collection',
            v_tracking_number, v_initial_history
        )
        RETURNING id INTO v_order_id;

        -- Insert order items
        FOR v_item IN SELECT * FROM jsonb_to_recordset(v_shop_items->v_shop_id::TEXT) AS y(product_id UUID, variant_id UUID, quantity INT, price_mad NUMERIC) LOOP
            INSERT INTO order_items (
                order_id, product_id, variant_id, quantity, price_mad
            ) VALUES (
                v_order_id, v_item.product_id, v_item.variant_id, v_item.quantity, v_item.price_mad
            );
            
            -- Deduct stock
            IF v_item.variant_id IS NOT NULL THEN
                UPDATE product_variants SET stock_quantity = stock_quantity - v_item.quantity WHERE id = v_item.variant_id;
            ELSE
                UPDATE products SET stock_quantity = stock_quantity - v_item.quantity WHERE id = v_item.product_id;
            END IF;
        END LOOP;

        -- Add to list of created order IDs
        v_created_orders := v_created_orders || to_jsonb(v_order_id);
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_ids', v_created_orders
    );
END;
$$ LANGUAGE plpgsql VOLATILE;


-- SEED DATA
-- 1. Categories
INSERT INTO categories (id, slug, name_translations) VALUES
('1a111111-1111-1111-1111-111111111111', 'jewelry', '{"en": "jewelry", "fr": "bijoux", "ar": "مجوهرات"}'),
('2b222222-2222-2222-2222-222222222222', 'art', '{"en": "art", "fr": "art", "ar": "فن"}'),
('3c333333-3333-3333-3333-333333333333', 'beauty', '{"en": "beauty", "fr": "beauté", "ar": "جمال"}'),
('4d444444-4444-4444-4444-444444444444', 'clothing', '{"en": "clothing", "fr": "vêtements", "ar": "ملابس"}'),
('5e555555-5555-5555-5555-555555555555', 'bags', '{"en": "bags", "fr": "sacs", "ar": "حقائب"}'),
('6f666666-6666-6666-6666-666666666666', 'home-living', '{"en": "home living", "fr": "maison et vie", "ar": "المنزل والمعيشة"}');
