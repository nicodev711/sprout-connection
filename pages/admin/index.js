import AdminPanel from '@/components/dashboard/AdminPanel';
import Head from "next/head";
import withAdminAuth from "@/hoc/withAdminAuth";

function AdminPage() {
    return (
        <div>
            <AdminPanel />
        </div>
    );
}

export default withAdminAuth(AdminPage)