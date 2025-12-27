import { fetchAllNamelessTournaments } from "@/lib/startgg";
import EventsClient from "./EventsClient";

export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
    // 1. Fetch tournaments on the server
    const tournaments = await fetchAllNamelessTournaments();

    // 2. Pass data to client component
    return (
        <EventsClient initialTournaments={tournaments} />
    );
}
