import { Component } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore/lite';
import { app } from "./firebase";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: []
    }
  }

  async refreshNotes() {
    var notesList = [];
    const db = getFirestore(app);
    const notesCol = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCol);

    notesSnapshot.forEach(doc => {
      let note = doc.data();
      note.id = doc.id;
      notesList.push(note);
    });
    this.setState({ notes: notesList });
  }

  componentDidMount() {
    this.refreshNotes();
  }

  async addClick() {
    var newNotes = document.getElementById("newNotes").value;
    var newNotesObject = { Description: newNotes };
    const db = getFirestore(app);
    const notesCol = collection(db, 'notes');
    await addDoc(notesCol, newNotesObject);
    this.refreshNotes();
  }

  async deleteClick(id) {
    const db = getFirestore(app);
    const notesRef = doc(db, 'notes/' + id);

    await deleteDoc(notesRef);

    this.refreshNotes();
  }

  render() {
    const { notes } = this.state;

    return (
      <div className="container">
        <article>
          <h1 style={{ textAlign: "center" }}>Todo list ^^</h1>

          <article>
            <input id="newNotes" />&nbsp;
            <button onClick={() => this.addClick()}>Add note</button>
          </article>

          <article>
            <ul>
              {notes.map(note =>
                <>
                  <div className="grid">
                    <li key={note.id}>{note.Description}</li>
                    <button onClick={() => this.deleteClick(note.id)}>Delete note</button>
                  </div>
                </>
              )}
            </ul>
          </article>
        </article>
      </div >
    );
  }
}

export default App
