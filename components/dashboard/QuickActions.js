import { useState } from 'react';
import Link from "next/link";

export default function QuickActions({ user }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/press-release', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, content }),
        });

        if (response.ok) {
            // Handle success (e.g., reset form, close modal, show success message)
            setTitle('');
            setDescription('');
            setContent('');
            document.getElementById('my_modal_3').close();
            alert('Press release added successfully!');
        } else {
            // Handle error
            alert('Failed to add press release.');
        }
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.isAdmin ? (
                    <>
                        <Link href={"/products/add"} className="btn btn-accent">Add New Product</Link>
                        <Link href={"/products/manage"} className="btn btn-accent">Manage Products</Link>
                        <button className="btn btn-accent" disabled>View Messages</button>
                        <button className="btn btn-accent" disabled>Manage Users</button>
                        <button className="btn btn-accent" disabled>Manage Settings</button>
                        <button className="btn btn-accent" disabled>Manage Settings</button>
                        <button
                            className="btn btn-accent"
                            onClick={() => document.getElementById('my_modal_3').showModal()}
                        >
                            Add Press Release
                        </button>
                        <dialog id="my_modal_3" className="modal">
                            <div className="modal-box">
                                <form onSubmit={handleSubmit}>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                        onClick={() => document.getElementById('my_modal_3').close()}
                                    >
                                        ✕
                                    </button>
                                    <h3 className="font-bold text-lg">Add Press Release</h3>
                                    <div className="py-4">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="input input-bordered w-full"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                className="textarea textarea-bordered w-full"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700" htmlFor="content">
                                                Content
                                            </label>
                                            <textarea
                                                id="content"
                                                className="textarea textarea-bordered w-full"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-accent mt-2">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </dialog>
                    </>
                ) : (
                    <>
                        <Link href={"/products/add"} className="btn btn-accent">Add New Product</Link>
                        <Link href={"/products/manage"} className="btn btn-accent">Manage Products</Link>
                        <button className="btn btn-accent" disabled>View Messages</button>
                        <button className="btn btn-accent" disabled>Manage Settings</button>
                    </>
                )}
            </div>
        </section>
    );
}
