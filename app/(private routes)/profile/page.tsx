import Image from "next/image";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerMe } from "@/lib/api/serverApi";

export const generateMetadata = async (): Promise<Metadata> => {
  const user = await getServerMe();

  return {
    title: `${user.username}`,
    description: `Profile: ${user.username}`,
    openGraph: {
      title: `${user.username}`,
      description: `Profile: ${user.username}`,
      url: `https://09-auth-etzb.vercel.app/profile`,
      siteName: "Profile User",
      images: [
        {
          url: user.avatar,
          width: 1200,
          height: 630,
          alt: "Profile",
        },
      ],
      type: "website",
    },
  };
};

const Profile = async () => {
  const user = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
