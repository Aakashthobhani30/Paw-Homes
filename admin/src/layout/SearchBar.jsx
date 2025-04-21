import React from "react";

const SearchBar = () => {
    return (
        <div className="container mt-2 text-dark">
            <div className="row">
                <div className="clo-5">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                            <i className="fa fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="from-control bg-light text-dark p-2"
                            placeholder="Search..."
                            aria-label="Search"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SearchBar