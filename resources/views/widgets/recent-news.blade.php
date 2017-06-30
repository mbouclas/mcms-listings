<div>

    Showing {{$config['show']}} news
    @if($config['users'])
    <ul>
        @foreach ($users as $user)
            <li>This is user {{ $user->firstName }} {{ $user->lastName }}</li>
        @endforeach
    </ul>
    @endif

</div>