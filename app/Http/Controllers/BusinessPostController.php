<?php

namespace App\Http\Controllers;

use App\Models\BusinessPost;

class BusinessPostController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => BusinessPost::queryable()->paginate(),
        ]);
    }

    public function show()
    {
        return response()->json([
            'data' => BusinessPost::queryable()->firstOrFail(request('id')),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...BusinessPost::rules());
        BusinessPost::create($validated);

        return response()->noContent();
    }

    public function update(BusinessPost $business_post)
    {
        $validated = request()->validate(...BusinessPost::rules('update'));
        $business_post->update($validated);

        return response()->noContent();
    }

    public function delete(BusinessPost $business_post)
    {
        $business_post->delete();

        return response()->noContent();
    }
}