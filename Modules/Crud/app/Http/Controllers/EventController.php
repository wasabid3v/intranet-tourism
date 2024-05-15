<?php

namespace App\Http\Controllers;

use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Event::queryable()->paginate(),
        ]);
    }

    public function show()
    {
        return response()->json([
            'data' => Event::queryable()->firstOrFail(request('id')),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Event::rules());
        Event::create($validated);

        return response()->noContent();
    }

    public function update(Event $resource)
    {
        $validated = request()->validate(...Event::rules('update'));
        $resource->update($validated);

        return response()->noContent();
    }

    public function delete(Event $resource)
    {
        $resource->delete();

        return response()->noContent();
    }
}