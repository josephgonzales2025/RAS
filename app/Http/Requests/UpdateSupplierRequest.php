<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $supplierId = $this->route('supplier')->id ?? $this->route('supplier');
        
        return [
            'ruc_dni' => ['sometimes', 'required', 'string', 'regex:/^[0-9]{8}$|^[0-9]{11}$/', 'unique:suppliers,ruc_dni,' . $supplierId],
            'business_name' => 'sometimes|required|string|max:255'
        ];
    }
}
