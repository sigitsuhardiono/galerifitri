<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransaksiPost extends FormRequest
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
            'namaPengirim'       => 'required',
            'namaPelangganDrop'  => 'required',
            'telpPelanggan'      => 'required',
            'alamatPelanggan'    => 'required',
            'propinsiPelanggan'  => 'required',
            'kabupatenPelanggan' => 'required',
            'ongkosKirim'        => 'required',
            'ongkosKirimService' => 'required',
            'courier'            => 'required',
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
            'namaPengirim.required'       => 'Nama Pengirim harus diisi',
            'namaPelangganDrop.required'  => 'Nama pelanggan harus diisi',
            'telpPelanggan.required'      => 'HP pelanggan harus diisi',
            'alamatPelanggan.required'    => 'Alamat pelanggan harus diisi',
            'propinsiPelanggan.required'  => 'Propisnsi pelanggan harus diisi',
            'kabupatenPelanggan.required' => 'Kabupaten pelanggan harus diisi',
            'ongkosKirim.required'        => 'Ongkis Kirim harus diisi',
            'ongkosKirimService.required' => 'Layanan Kirim harus diisi',
            'courier.required'            => 'Kurir pelanggan harus diisi',
        ];
    }
}
