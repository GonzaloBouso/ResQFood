export default function AdminTabs({ selected, setSelected }) {
  const tabs = ["Reportes", "Bitácora"];
  return (
    <div className="flex border-b mt-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelected(tab)}
          className={`px-4 py-2 font-medium ${
            selected === tab
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
