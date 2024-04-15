import InputBox from "../components/input";

const UserAuthForm = ({ type }) => {
    return (
        <section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome back" : "Join now" }
                </h1>

                {
                    type != "sign-in" ? 
                    <InputBox 
                        name="fullname"
                        type="text"
                        placeholder="full name"
                    /> 
                    : ""
                }
            </form>
        </section>
    )
}

export default UserAuthForm;