export default function Trash() {
  const [trashItems, setTrashItems] = useState([]);

  useEffect(() => {
    // Fetch temporary deleted notes
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Trash</h1>
      <ul>
        {trashItems.map((note, index) => (
          <li key={index} className="mb-2 p-4 bg-red-100 rounded shadow">
            {note.content}
            {/* Permanently Delete action */}
          </li>
        ))}
      </ul>
    </div>
  );
}
