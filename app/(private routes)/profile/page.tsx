import Image from "next/image";
import css from './ProfilePage.module.css';
import Link from "next/link";
import { Metadata } from "next";
import { getServerMe } from "@/lib/api/serverApi";


export const generateMetadata = async (): Promise<Metadata> => {
    const { data } = await getServerMe();

    return {
        title: `${data.username}`,
        description: `Profile: ${data.username}`,
        openGraph: {
            title: `${data.username}`,
            description: `Profile: ${data.username}`,
            url: `https://09-auth-etzb.vercel.app/profile`,
            siteName: "Profile User",
            images: [
                {
                    url: `${data.avatar}`,
                    width: 1200,
                    height: 630,
                    alt: `Profile`

                }
            ],
            type: 'website',
        }
    }
}

const Profile = async () => {

    const { data } = await getServerMe();



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
                        src={`${data.avatar}`}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                        priority={true}
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>
                        Username: {data.username}
                    </p>
                    <p>
                        Email: {data.email}
                    </p>
                </div>
            </div>
        </main>

    )
}

export default Profile