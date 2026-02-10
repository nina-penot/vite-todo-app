import { useState } from "react";
import useApi from "../hooks/useApi";

export default function UserLoginForm({ onLogin }) {

    //input values
    const [email_value, setEmailValue] = useState("");
    const [pass_value, setPassValue] = useState("");

    //errors
    const [err_email, setErrEmail] = useState("");
    const [err_pass, setErrPass] = useState("");

    //hook
    const { users } = useApi();

    function handleErrors() {

        //resets first to clear previous errors
        setErrEmail("");
        setErrPass("");

        //error tracker
        let has_errors = false;

        //email regex
        const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email_regex.test(email_value)) {
            setErrEmail("Veuillez utiliser le format d'un email (exemple@email.com).");
            has_errors = true;
        }
        if (email_value == "") {
            setErrEmail("L'email ne peut pas être vide.");
            has_errors = true;
        }
        if (pass_value == "") {
            setErrPass("Le mot de passe ne peut pas être vide.");
            has_errors = true;
        }

        if (has_errors) {
            return true;
        } else {
            return false;
        }
    }

    function handleClick(e) {
        e.preventDefault();
        handleErrors();
        if (handleErrors()) {
            return;
        } else {
            //log user
            onLogin(email_value, pass_value);
        }
    }

    return (
        <form>
            <div>Email</div>
            <input onChange={(e) => { setEmailValue(e.target.value) }}
                className="todo-input" type="email"></input>
            {err_email && <p className="erreur">{err_email}</p>}
            <div>Mot de passe</div>
            <input onChange={(e) => { setPassValue(e.target.value) }}
                className="todo-input" type="password"></input>
            {err_pass && <p className="erreur">{err_pass}</p>}
            <button onClick={handleClick} className="btn-editer" type="submit">SE CONNECTER</button>
        </form>
    )
}