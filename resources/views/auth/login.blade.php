@extends('layout.auth')
@section('content')
    <form id="sign-in" method="POST" action="{{ route('login') }}">
        @csrf
        <div class="msg">Sign in to start your session</div>
        <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">person</i>
                        </span>
            <div class="form-line">
                <input id="email" type="email" placeholder="{{ __('E-Mail Address') }}"
                       class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}"
                       name="email" value="{{ old('email') }}" required autofocus>

                @if ($errors->has('email'))
                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                @endif
            </div>
        </div>
        <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">lock</i>
                        </span>
            <div class="form-line">
                <input id="password" type="password" placeholder="{{ __('Password') }}" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>
                @if ($errors->has('password'))
                    <span class="invalid-feedback">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                @endif
            </div>
        </div>
        <div class="row">
            <div class="col-xs-8 p-t-5">
                <input type="checkbox"
                       name="rememberme" id="rememberme" {{ old('remember') ? 'checked' : '' }} class="filled-in chk-col-pink">
                <label for="rememberme">Remember Me</label>
            </div>
            <div class="col-xs-4">
                <button class="btn btn-block bg-pink waves-effect" type="submit">SIGN IN</button>
            </div>
        </div>
        <div class="row m-t-15 m-b--20">
            <div class="col-xs-6">
                <a href="sign-up.html">Register Now!</a>
            </div>
            <div class="col-xs-6 align-right">
                <a  href="{{ route('password.request') }}">
                    {{ __('Forgot Password?') }}
                </a>
            </div>
        </div>
    </form>
@endsection
