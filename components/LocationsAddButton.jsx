"use client"

import {Plus} from "lucide-react";
import LocationsAddModal from "@/components/LocationsAddModal";


export default function LocationsAddButton() {
    return(
        <>
            <div className="fab">
                <button
                    className="btn bg-primary p-4 text-success-content rounded-full hover:opacity-90 hover:cursor-pointer"
                    onClick={()=>document.getElementById('LocationsAddModal').showModal()}
                >
                    <Plus size={24} className="text-primary-content"/>
                </button>
            </div>

            <dialog id="LocationsAddModal" className="modal">
                <div className="modal-box max-w-2xl">
                    <LocationsAddModal />
                </div>
            </dialog>
        </>
    )
}