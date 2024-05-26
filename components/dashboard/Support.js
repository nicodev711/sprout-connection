import Link from "next/link";

export default function Support() {
    return (
        <section className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Support and Help</h2>
                <Link href="mailto:support@sproutconnections.com?subject=Support%20Request%20from%20[Your%20Username]" className="btn btn-primary">
                    Contact Support
                </Link>
            </div>
            <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox"/>
                <div className="collapse-title text-md font-medium">
                    <p>For a quicker response, please include the following details in your email:</p>
                </div>
                <div className="collapse-content">
                    <ul className="list-disc list-inside mb-4">
                        <li>Your username and registered email address</li>
                        <li>A brief description of the issue you&apos;re facing</li>
                        <li>Any error messages you have received</li>
                        <li>Screenshots of the issue (if applicable)</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
