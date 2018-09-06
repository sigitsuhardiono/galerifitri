<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PelangganPost extends FormRequest
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
            'alamat'             => 'required',
            'propinsiPelanggan'  => 'required',
            'kabupatenPelanggan' => 'required',
            'telp'               => 'required',
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
            'alamat.required'             => 'Alamat approve harus diisi',
            'propinsiPelanggan.required'  => 'Propinsi approve harus diisi',
            'kabupatenPelanggan.required' => 'Kanupaten approve harus diisi',
            'telp.required'               => 'Telp approve harus diisi',
        ];
    }
}
