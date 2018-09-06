<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProdukEditPost extends FormRequest
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
            'code'       => 'required',
            'name'       => 'required',
            'brand'      => 'required',
            'iddetail.0' => 'required',
            'size.0'     => 'required',
            'stok.0'     => 'required',
            'harga.0'    => 'required',
            'berat.0'    => 'required',
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
            'code.required'    => 'Code harus diisi',
            'name.required'    => 'Nama harus diisi',
            'size.0.required'  => 'Ukuran harus diisi,minimal 1 data',
            'stok.0.required'  => 'Stok harus diisi,minimal 1 data',
            'harga.0.required' => 'Harga harus diisi,minimal 1 data',
            'berat.0.required' => 'Barat harus diisi,minimal 1 data',
        ];
    }
}
