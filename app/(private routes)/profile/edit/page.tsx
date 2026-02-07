'use client'
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfile.module.css';
import Image from "next/image"
import { updateProfileUser } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
    const { user, setUser } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const newUserName = (formData.get('username') as string).trim();
        if (!newUserName) {
            toast.error("This input not empty")
            return;
        }
        if (newUserName && user) {
            const payload = {
                ...user,
                username: newUserName,
            }

            const newData = await updateProfileUser(payload)
            setUser(newData);
        }
        router.push('/profile')

    }

    const CancelEditPage = () => router.back();



    return (<main className={css.mainContent}>
        <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            {user?.avatar && <Image src={user.avatar}
                alt="User Avatar"
                width={120}
                height={120}
                className={css.avatar} priority={true}
            />}

            <form className={css.profileInfo} action={handleSubmit}>
                <div className={css.usernameWrapper}>
                    <label htmlFor="username">Username:</label>
                    <input id="username"
                        type="text" name='username' defaultValue={user?.username}
                        className={css.input}
                    />
                </div>

                <p>Email: ${user?.email}</p>

                <div className={css.actions}>
                    <button type="submit" className={css.saveButton}>
                        Save
                    </button>
                    <button type="button" className={css.cancelButton} onClick={CancelEditPage}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </main>
    )
}

export default EditProfile