import { useState } from 'react';
import './App.css';

// Import des composants
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';

// Import du hook custom
import useApi from './hooks/useApi';

function App() {
  // Hook custom pour gerer les todos (avec API backend)
  const { todos, loading, error, ajouterTodo, toggleTodo, supprimerTodo, editerTodo, toutSupprimer } = useApi();

  // State pour le filtre actif
  const [filtre, setFiltre] = useState('toutes');

  // Filtre les todos selon le filtre actif
  const filtrerTodos = () => {
    switch (filtre) {
      case 'actives':
        return todos.filter(todo => !todo.completed);
      case 'terminees':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Supprime tout avec confirmation
  const handleToutSupprimer = () => {
    if (window.confirm('Supprimer toutes les taches ?')) {
      toutSupprimer();
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="app-container">
      <h1>Ma TodoList</h1>

      {/* Formulaire d'ajout */}
      <TodoForm onAjouter={ajouterTodo} />

      {/* Statistiques */}
      <TodoStats todos={todos} />

      {/* Filtres */}
      <TodoFilter filtre={filtre} setFiltre={setFiltre} />

      {/* Liste des todos filtres */}
      <TodoList
        todos={filtrerTodos()}
        onToggle={toggleTodo}
        onSupprimer={supprimerTodo}
        onEditer={editerTodo}
      />

      {/* Bouton tout supprimer */}
      {todos.length > 0 && (
        <button onClick={handleToutSupprimer} className="btn-tout-supprimer">
          Tout supprimer
        </button>
      )}
    </div>
  );
}

export default App;
