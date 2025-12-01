import "../style.css"

export type navbarViewProps = {
    onLogoClick: () => void;
}

export function navbarView(props: navbarViewProps) {

    function logoClickACB() {
        props.onLogoClick();
    }

    return (
        <div className="header">
            <h1 onClick={logoClickACB} className="logo-text">
                CineMatch
            </h1>
            <div className="profile">
                Profile
            </div>
        </div>
    );
}