export default function UserWelcome({ username }) {
    if (!username) {
        username = "Utilisateur";
    }

    return (
        <section>
            <div>Bienvenue, {username}</div>
        </section>
    )
}