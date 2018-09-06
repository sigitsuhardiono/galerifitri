<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResellerPost extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nama'               => 'required',
            'email'              => 'required',
            'password'           => 'required',
            'alamat'             => 'required',
            'propinsiPelanggan'  => 'required',
            'kabupatenPelanggan' => 'required',
            'telp'               => 'required',
            'bbm'                => 'required',
            'wa'                 => 'required',
            'watemplate'         => 'required',
            'diskon'             => 'required',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'nama.required'               => 'Nama harus diisi',
            'email.required'              => 'Email harus diisi',
            'password.required'           => 'Password transfer harus diisi',
            'alamat.required'             => 'Alamat approve harus diisi',
            'propinsiPelanggan.required'  => 'Propinsi approve harus diisi',
            'kabupatenPelanggan.required' => 'Kanupaten approve harus diisi',
            'telp.required'               => 'Telp approve harus diisi',
            'bbm.required'                => 'BBM approve harus diisi',
            'wa.required'                 => 'WA approve harus diisi',
            'watemplate.required'         => 'Template WA approve harus diisi',
            'diskon.required'             => 'Diskon approve harus diisi',
            'deposit.required'            => 'Deposit approve harus diisi',
        ];
    }
}
