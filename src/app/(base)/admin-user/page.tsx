"use client";

import { useGetAdminUser } from "./hook";

export default function AdminPage() {
  const { data } = useGetAdminUser();
  console.log(data);
  return <div className="bg-gray-50 py-10">ada</div>;
}
