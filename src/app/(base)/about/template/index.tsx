import { useGetAbout } from "../hook";

export default function AboutClient() {
  const { data } = useGetAbout();
  console.log(data);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold">Template</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent nec massa. Cum sociis natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus.
        </p>
      </div>
    </div>
  );
}
