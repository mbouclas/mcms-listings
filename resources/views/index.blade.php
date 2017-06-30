@extends('admin::Layouts.master')

@section('js')
   @foreach($includeFiles['scripts'] as $file)
   {{$file}}
   @endforeach
@endsection

@section('css')
    @foreach($includeFiles['css'] as $file)
        {{$file}}
    @endforeach
@endsection

@section('content')

@endsection