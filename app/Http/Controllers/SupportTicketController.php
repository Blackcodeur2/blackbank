<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    /**
     * Display all tickets for the authenticated user.
     */
    public function index(): Response
    {
        $tickets = SupportTicket::where('user_id', Auth::id())
            ->withCount('replies')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('support/index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show a single ticket with its replies.
     */
    public function show(SupportTicket $ticket): Response
    {
        if ($ticket->user_id !== Auth::id()) {
            abort(403);
        }

        $ticket->load(['replies.user']);

        return Inertia::render('support/show', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Create a new support ticket.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'sujet'    => ['required', 'string', 'max:255'],
            'priorite' => ['required', 'in:basse,moyenne,haute'],
            'message'  => ['required', 'string', 'min:20', 'max:3000'],
        ]);

        $ticket = SupportTicket::create([
            'user_id'  => Auth::id(),
            'sujet'    => $request->sujet,
            'priorite' => $request->priorite,
            'statut'   => 'ouvert',
            'message'  => $request->message,
        ]);

        return redirect()->route('support.show', $ticket)
            ->with('success', 'Votre ticket a été soumis avec succès. Nous vous répondrons dans les meilleurs délais.');
    }

    /**
     * Add a reply to a ticket.
     */
    public function reply(Request $request, SupportTicket $ticket): \Illuminate\Http\RedirectResponse
    {
        if ($ticket->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'message' => ['required', 'string', 'min:5', 'max:2000'],
        ]);

        SupportTicketReply::create([
            'ticket_id'      => $ticket->id,
            'user_id'        => Auth::id(),
            'message'        => $request->message,
            'is_admin_reply' => false,
        ]);

        // Reopen if closed
        if (in_array($ticket->statut, ['resolu', 'ferme'])) {
            $ticket->update(['statut' => 'ouvert']);
        }

        return back()->with('success', 'Réponse envoyée.');
    }
}
