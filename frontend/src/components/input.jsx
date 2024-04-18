import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {

    const [ passwordVisible, setpasswordVisible ] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input 
                name={name}
                type={ type == "password" ? passwordVisible ? "text" : "password" : type} 
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
            />
            {/* render the icons beside the placeholder dynamically */}
            <i className={"fi " + icon + " input-icon"}></i>

            {/* add the hide & show icon for password  */}
            {
                type == "password" ? 
                <i className={"fi fi-sr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => setpasswordVisible(currentVal => !currentVal)}></i>
                : ""
            }
        </div>
    )
}

export default InputBox;