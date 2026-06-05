import { fetchProfile } from "@/lib/supabase";
import Link from "next/link";
import { IconMapPin, IconCalendar, IconUser } from "@tabler/icons-react";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { lang, id } = await params;
  let profile = null;

  try {
    profile = await fetchProfile(id);
  } catch (error) {
    console.error("Error fetching profile", error);
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 max-w-[1440px] mx-auto min-h-[50vh]">
        <h1 className="text-2xl font-bold text-black mb-4">User not found</h1>
        <p className="text-neutral-500 mb-6">The profile you are looking for does not exist or has been removed.</p>
        <Link href={`/${lang}`} className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar-MA' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });

  const shortName = profile.full_name?.split(' ')[0] || 'User';

  return (
    <div className="w-full pb-12 bg-white min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        
        {/* Left Sidebar Profile */}
        <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 flex flex-col z-10">
          
          {/* Avatar (No overlapping banner) */}
          <div className="flex items-center gap-4 mb-4 relative z-20">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-neutral-200 bg-white overflow-hidden flex-shrink-0 shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(shortName)}&background=E8583F&color=fff&size=160&bold=true`} alt="avatar" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          
          {/* Name */}
          <div className="flex flex-col mt-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#111827] leading-tight tracking-tight">
              {profile.full_name || 'Anonymous User'}
            </h1>
          </div>
          
          {/* Badges / Meta Info */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-bold border border-neutral-200 capitalize">
              <IconUser className="w-3.5 h-3.5" />
              {profile.role || 'Member'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6b7280] text-sm md:text-base mt-4 mb-4 font-medium">
            <IconCalendar className="w-4 h-4 md:w-5 md:h-5" />
            <span>Joined {joinDate}</span>
          </div>

          {profile.bio ? (
            <p className="text-sm md:text-base text-[#4b5563] leading-relaxed mb-6 font-medium mt-1">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed mb-6 font-medium mt-1 italic">
              No bio provided yet.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button className="w-full py-3 bg-[#E8583F] hover:bg-[#d44831] text-white font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2">
              Follow User
            </button>
            <button className="w-full py-3 bg-white border-2 border-black hover:bg-neutral-50 text-black font-bold text-sm rounded-full transition-colors flex items-center justify-center gap-2">
              Message
            </button>
          </div>
          
        </div>

        {/* Main Content: Right Side Tabs & Feed */}
        <div className="flex-1 w-full pt-10 lg:pt-0">
          {/* Behance Style Tab Headers */}
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-3 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <h2 className="text-sm font-bold text-black border-b-2 border-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer">
              Activity
            </h2>
            <h2 className="text-sm font-bold text-neutral-400 hover:text-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors">
              Favorites
            </h2>
            <h2 className="text-sm font-bold text-neutral-400 hover:text-black pb-3 -mb-[14px] whitespace-nowrap cursor-pointer transition-colors">
              Collections
            </h2>
          </div>

          {/* Activity Placeholder */}
          <div className="w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-8 md:p-16 flex flex-col items-center justify-center text-center mt-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <IconUser className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">No public activity yet</h3>
            <p className="text-sm text-neutral-500 max-w-sm">
              This user hasn't added any public favorites, collections, or left any reviews.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
