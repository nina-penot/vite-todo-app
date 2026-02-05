import { useState, useEffect } from "react";
// Import du hook custom
import useApi from "../hooks/useApi";


export default function UserRegisterForm({ onRegister }) {

    //input values
    const [email_value, setEmailValue] = useState("");
    const [name_value, setNameValue] = useState("");
    const [pass_value, setPassValue] = useState("");

    //errors
    const [err_email, setErrEmail] = useState("");
    const [err_name, setErrName] = useState("");
    const [err_pass, setErrPass] = useState("");

    //success
    const [success, setSuccess] = useState("");

    //hook
    const { users } = useApi();
    //console.log(users);

    // function handleErrors() {

    //     //resets first to clear previous errors
    //     setErrEmail("");
    //     setErrName("");
    //     setErrPass("");

    //     //email regex
    //     const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (!email_regex.test(email_value)) {
    //         setErrEmail("Veuillez utiliser le format d'un email (exemple@email.com).");
    //     }
    //     if (email_value == "") {
    //         setErrEmail("L'email ne peut pas être vide.");
    //     }
    //     if (users) {
    //         //find user
    //         const userExists = users.find(u => u.email === email_value);
    //         if (userExists) {
    //             setErrEmail("Cet email existe déjà.");
    //         }
    //     }

    //     if (name_value == "") {
    //         setErrName("Le nom ne peut pas être vide.");
    //     }

    //     if (pass_value == "") {
    //         setErrPass("Le mot de passe ne peut pas être vide.");
    //     }


    //     if (err_email || err_name || err_pass) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    useEffect(() => {
        if (success) {
            console.log("success detected!!");
            let mytime = setTimeout(() => {
                setSuccess("");
            }, 4000);
            return clearTimeout(mytime);
        }
    }, [success])

    function handleClick(e) {
        e.preventDefault();
        let has_errors = false;

        //resets first to clear previous errors
        setErrEmail("");
        setErrName("");
        setErrPass("");

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
        if (users) {
            //find user
            const userExists = users.find(u => u.email === email_value);
            if (userExists) {
                setErrEmail("Cet email existe déjà.");
                has_errors = true;
            }
        }

        if (name_value == "") {
            setErrName("Le nom ne peut pas être vide.");
            has_errors = true;
        }

        if (pass_value == "") {
            setErrPass("Le mot de passe ne peut pas être vide.");
            has_errors = true;
        }

        if (has_errors) {
            return;
        }

        //register the user
        onRegister(email_value.trim(), pass_value.trim(), name_value.trim());
        setSuccess("Inscrit avec succès.");
        setEmailValue('');
        setNameValue('');
        setPassValue('');
        setErrEmail('');
        setErrName('');
        setErrPass('');

    }

    return (
        <form>
            {success && <p>{success}</p>}
            <div>Email</div>
            <input onChange={(e) => { setEmailValue(e.target.value) }}
                className="todo-input" type="email" value={email_value}></input>
            {err_email && <p className="erreur">{err_email}</p>}
            <div>Nom</div>
            <input onChange={(e) => { setNameValue(e.target.value) }}
                className="todo-input" type="text" value={name_value}></input>
            {err_name && <p className="erreur">{err_name}</p>}
            <div>Mot de passe</div>
            <input onChange={(e) => { setPassValue(e.target.value) }}
                className="todo-input" type="password" value={pass_value}></input>
            {err_pass && <p className="erreur">{err_pass}</p>}
            <button onClick={handleClick} className="btn-editer">S'INSCRIRE</button>
        </form>
    )
}