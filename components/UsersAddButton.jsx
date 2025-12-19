"use client"

import {Plus} from "lucide-react";
import UsersAddModal from "./UsersAddModal";

export default function UsersAddButton() {
    return(
        <>
            <div className="fab">
                <button
                    className="btn bg-success p-4 text-success-content rounded-full hover:opacity-90 hover:cursor-pointer"
                    onClick={()=>document.getElementById('UsersAddModal').showModal()}
                >
                    <Plus size={24}/>
                </button>
            </div>

            <dialog id="UsersAddModal" className="modal">
                <div className="modal-box max-w-2xl">
                    <UsersAddModal />
                </div>
            </dialog>
        </>
    )
}