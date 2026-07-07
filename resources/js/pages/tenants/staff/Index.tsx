import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/react';

export default function Index() {
    const { staff } = usePage<any>().props;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Staff</h1>
                <InertiaLink href="./create" className="btn">New staff</InertiaLink>
            </div>

            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="text-left">Name</th>
                        <th className="text-left">Email</th>
                        <th className="text-left">Phone</th>
                        <th className="text-left">Position</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {staff.data?.map((s: any) => (
                        <tr key={s.id} className="border-t">
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.position}</td>
                            <td className="text-right">
                                <InertiaLink href={`./${s.id}/edit`} className="text-blue-600">Edit</InertiaLink>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                {/* simple pagination links */}
                {staff.links?.map((link: any, idx: number) => (
                    <span key={idx} dangerouslySetInnerHTML={{ __html: link.label }} />
                ))}
            </div>
        </div>
    );
}
