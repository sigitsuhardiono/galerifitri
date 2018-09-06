<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepositiPost extends FormRequest
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
            'userId'      => 'required',
            'nominal'     => 'required',
            'tgltransfer' => 'required',
            'tglapprove'  => 'required',
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
            'userId.required'       => 'User harus diisi',
            'nominal.required'  => 'Nominal harus diisi',
            'tgltransfer.required'      => 'Tanggal transfer harus diisi',
            'tglapprove.required'    => 'Tanggal approve harus diisi',
        ];
    }
}
