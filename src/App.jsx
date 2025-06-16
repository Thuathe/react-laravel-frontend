import { useEffect, useState } from "react";

function App() {
  const [buku, setBuku] = useState([]);
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = () => {
    fetch("https://react-laravel-backend-production-83ba.up.railway.app//api/buku")
      .then((res) => res.json())
      .then((data) => setBuku(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { judul, penulis };

    if (editId) {
      // UPDATE
      fetch(`https://react-laravel-backend-production-83ba.up.railway.app//api/buku/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        setEditId(null);
        setJudul("");
        setPenulis("");
        fetchData();
      });
    } else {
      // CREATE
      fetch("https://react-laravel-backend-production-83ba.up.railway.app//api/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        setJudul("");
        setPenulis("");
        fetchData();
      });
    }
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setJudul(b.judul);
    setPenulis(b.penulis);
  };

  const handleDelete = (id) => {
    fetch(`https://react-laravel-backend-production-83ba.up.railway.app//api/buku/${id}`, {
      method: "DELETE",
    }).then(() => fetchData());
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 Daftar Buku</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Penulis"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
          required
        />
        <button type="submit">{editId ? "Update" : "Tambah"}</button>
      </form>

      <ul>
        {buku.map((b) => (
          <li key={b.id}>
            <strong>{b.judul}</strong> - {b.penulis}{" "}
            <button onClick={() => handleEdit(b)}>Edit</button>{" "}
            <button onClick={() => handleDelete(b.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
