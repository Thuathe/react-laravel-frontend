import { useEffect, useState } from "react";

function App() {
  const [buku, setBuku] = useState([]);
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [editId, setEditId] = useState(null);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);

  // Ganti dengan URL backend Railway kamu
  const baseUrl = "http://127.0.0.1:8000";

  const fetchData = () => {
    fetch(`${baseUrl}/api/buku`)
      .then((res) => res.json())
      .then((data) => setBuku(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    if (cover) {
      formData.append("cover", cover);
    }

    const isEdit = !!editId;
    const url = isEdit
      ? `${baseUrl}/api/buku/${editId}`
      : `${baseUrl}/api/buku`;

    if (isEdit) {
      formData.append("_method", "PUT");
    }

    fetch(url, {
      method: "POST", // tetap POST agar bisa upload file
      body: formData,
    }).then(() => {
      setJudul("");
      setPenulis("");
      setCover(null);
      setPreview(null);
      setEditId(null);
      fetchData();
    });
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setJudul(b.judul);
    setPenulis(b.penulis);
    setCover(null); // Kosongkan file input
    if (b.cover) {
      setPreview(`${baseUrl}/storage/${b.cover}`);
    } else {
      setPreview(null);
    }
  };

  const handleDelete = (id) => {
    fetch(`${baseUrl}/api/buku/${id}`, {
      method: "DELETE",
    }).then(() => fetchData());
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📚 Daftar Buku - EKA TAPI</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setCover(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            width="100"
            style={{ display: "block", marginTop: 10 }}
          />
        )}
        <button type="submit" style={{ marginTop: 10 }}>
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      <ul style={{ marginTop: 30 }}>
        {buku.map((b) => (
          <li key={b.id} style={{ marginBottom: 20 }}>
            {b.cover && (
              <img
                src={`${baseUrl}/storage/${b.cover}`}
                alt="cover"
                width="100"
              />
            )}
            <br />
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
