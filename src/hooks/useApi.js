import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function useApi() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les todos (GET)
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors de la récupération des todos');
      const data = await response.json();
      setTodos(data.data.map(todo => ({
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

  // Appel au montage du composant
  useEffect(() => {
    fetchTodos();
  }, []);

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

  };

  // TODO : Supprimer un todo (DELETE) et rafraîchir la liste
  const supprimerTodo = async (id) => {

  };

  // Modifier le texte d'un todo (PUT)
  const editerTodo = async (id, nouveauTexte) => {
    const todo = todos.find(t => t.id === id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: nouveauTexte, completed: todo.completed ? 1 : 0 })
    });
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

  return {
    todos,
    loading,
    error,
    ajouterTodo,
    toggleTodo,
    supprimerTodo,
    editerTodo,
    toutSupprimer
  };
}

export default useApi;
