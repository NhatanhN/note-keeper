import { deleteUser } from "@/app/api/databaseInterface";

export async function DELETE(request) {
    // verify cookie authentification
    // if not authorized
    // return new Response("not authorized", {status: xxx})
    
    const { id } = request.params;
    try {
        await deleteUser(id);
        return new Response("User deleted successfully", { status: 200 });
    } catch (error) {
        return new Response(error.message, { status: 500 });
    }id
}