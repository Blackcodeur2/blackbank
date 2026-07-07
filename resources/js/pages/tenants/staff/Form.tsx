import React, { useState, useRef } from 'react';
import { usePage, Inertia } from '@inertiajs/react';

export default function Form() {
    const { staff } = usePage<any>().props;
    const [form, setForm] = useState<any>({
        name: staff?.name ?? '',
        email: staff?.email ?? '',
        phone: staff?.phone ?? '',
        position: staff?.position ?? '',
    });
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('email', form.email || '');
        fd.append('phone', form.phone || '');
        fd.append('position', form.position || '');

        if (inputRef.current?.files?.[0]) fd.append('avatar', inputRef.current.files[0]);

        if (staff) {
            Inertia.post(`./${staff.id}`, fd, { method: 'put' });
        } else {
            Inertia.post('./', fd);
        }
    }

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">{staff ? 'Edit staff' : 'New staff'}</h1>
            <form onSubmit={submit} encType="multipart/form-data">
                <div className="mb-2">
                    <label className="block">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input" required />
                </div>
                <div className="mb-2">
                    <label className="block">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} className="input" />
                </div>
                <div className="mb-2">
                    <label className="block">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="input" />
                </div>
                <div className="mb-2">
                    <label className="block">Position</label>
                    <input name="position" value={form.position} onChange={handleChange} className="input" />
                </div>
                <div className="mb-4">
                    <label className="block">Avatar</label>
                    <input ref={inputRef} name="avatar" type="file" accept="image/*" />
                </div>
                <div>
                    <button className="btn" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}
