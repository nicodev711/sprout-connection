import { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';

export default function PressRelease() {
    const [pressReleases, setPressReleases] = useState([]);
    const [selectedRelease, setSelectedRelease] = useState(null);

    useEffect(() => {
        const fetchPressReleases = async () => {
            const response = await fetch('/api/press-release');
            const data = await response.json();
            setPressReleases(data);
        };

        fetchPressReleases();
    }, []);

    const handleReadMore = (release) => {
        setSelectedRelease(release);
        document.getElementById('release_modal').showModal();
    };

    const handleCloseModal = () => {
        document.getElementById('release_modal').close();
        setSelectedRelease(null);
    };

    return (
        <section className="col-span-1 md:col-span-3 bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold">Press Releases</h2>
            <div className="space-y-4">
                {pressReleases.length > 0 ? (
                    pressReleases.map(release => (
                        <div key={release._id} className="p-4 bg-gray-50 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">{release.title}</h3>
                            <p>{release.description}</p>
                            <button className="btn btn-accent mt-2" onClick={() => handleReadMore(release)}>Read More</button>
                        </div>
                    ))
                ) : (
                    <p>No press release yet</p>
                )}
            </div>

            <dialog id="release_modal" className="modal">
                <div className="modal-box">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={handleCloseModal}
                    >
                        ✕
                    </button>
                    {selectedRelease && (
                        <>
                            <h3 className="font-bold text-lg">{selectedRelease.title}</h3>
                            <div className="py-4">{ReactHtmlParser(selectedRelease.content)}</div>
                        </>
                    )}
                </div>
            </dialog>
        </section>
    );
}
