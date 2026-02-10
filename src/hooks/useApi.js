import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const USERS_URL = import.meta.env.VITE_API_USER_URL;
const REGISTER_URL = import.meta.env.VITE_REGISTER;
const LOGIN_URL = import.meta.env.VITE_LOGIN;

function useApi() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const [soft_error, setSoftError] = useState(null);

  // Récupérer tous les todos (GET)
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors de la récupération des todos');
      const data = await response.json();
      //console.log(data);
      setTodos(data.results.map(todo => ({
        id: todo.id,
        texte: todo.text,
        completed: todo.completed === 1
      })));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //récupérer tous les users
  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_URL);
      if (!response.ok) throw new Error('Erreur lors de la récupération des users');
      const data = await response.json();
      setUsers(data.results.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      })));
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Appel au montage du composant
  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);


  // DB_TODOS MANAGEMENT
  //---------------------------
  // Ajouter un todo (POST)
  const ajouterTodo = async (texte) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texte, completed: 0 })
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout");
    await fetchTodos();
  };

  // TODO : Modifier un todo (PUT) et rafraîchir la liste
  const toggleTodo = async (id) => {
    try {
      // on trouve le todo à modifier
      const todo = todos.find(t => t.id === id);
      //console.log(todos);
      if (!todo) throw new Error("Todo non trouvé");

      // on envoie la requête PUT avec l'état inversé
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: todo.texte,
          completed: todo.completed ? false : true  // Inverse l'état
        })
      });

      //console.log(response);
      if (!response.ok) throw new Error("Erreur lors de la modification");

      //on rafraichit la liste
      await fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  // TODO : Supprimer un todo (DELETE) et rafraîchir la liste
  const supprimerTodo = async (id) => {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });
    //console.log(response);
    if (!response.ok) throw new Error("Erreur lors de la suppression.");
    await fetchTodos();
  };

  // Modifier le texte d'un todo (PUT)
  const editerTodo = async (id, nouveauTexte) => {
    //console.log("editerTodo: ", id, nouveauTexte, ":end editerTodo");
    const todo = todos.find(t => t.id === id);
    const response = await fetch(API_URL + "/" + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: nouveauTexte, completed: todo.completed })
    });
    //console.log(response);
    if (!response.ok) throw new Error("Erreur lors de l'édition");
    await fetchTodos();
  };

  // Supprimer tous les todos
  const toutSupprimer = async () => {
    await Promise.all(todos.map(todo =>
      fetch(`${API_URL}/${todo.id}`, { method: 'DELETE' })
    ));
    await fetchTodos();
  };

  // DB_USERS MANAGEMENT
  //------------------------

  //register/create user
  const registerUser = async (email, password, name) => {
    try {
      //console.log("registerUser from API: ", email, password, name);
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password, name: name })
      });
      if (!response.ok) {
        let message = await response.json();
        console.log(message.message);
        throw new Error("Erreur lors de l'inscription.");
      }
      await fetchUsers();
    } catch (err) {
      setSoftError("Erreur lors de l'inscription, cet email existe peut-être déjà.");
    }

  };

  //login user
  const loginUser = async (email, password) => {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });
    if (!response.ok) throw new Error("Erreur lors du login");
    sessionStorage.setItem("login", email);
    //await fetchUsers();
  };

  //logout user
  const logoutuser = () => {
    sessionStorage.clear();
  }

  //reset softerror
  const resetSoftError = () => {
    setSoftError(null);
  }

  return {
    todos,
    users,
    loading,
    error,
    soft_error,
    ajouterTodo,
    toggleTodo,
    supprimerTodo,
    editerTodo,
    toutSupprimer,
    registerUser,
    loginUser,
    resetSoftError
  };
}

export default useApi;
