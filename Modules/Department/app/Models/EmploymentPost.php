<?php

namespace Modules\Department\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;;

use Database\Factories\EmploymentPostFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class EmploymentPost extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'employment_posts';

    protected static function newFactory()
    {
        return EmploymentPostFactory::new();
    }

    protected $fillable = [
        'department_id',
        'business_post_id',
        'business_grade_id',
        'business_scheme_id',
        'user_id',
    ];

    protected $appends = [
        'fullGrade',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'department_id' => ['string', 'required'],
                    'business_post_id' => ['string', 'required'],
                    'business_grade_id' => ['string', 'required'],
                    'business_scheme_id' => ['string', 'required'],
                    'user_id' => ['string'],
                    'location' => ['string'],
                    'order' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'department_id' => ['string', 'required'],
                    'business_post_id' => ['string'],
                    'business_grade_id' => ['string'],
                    'business_scheme_id' => ['string'],
                    'user_id' => ['string', 'required'],
                    'order' => ['string'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function getFullGradeAttribute()
    {
        $businessSchemeCode = $this->businessScheme ? $this->businessScheme->code : '';
        $businessGradeCode = $this->businessGrade ? $this->businessGrade->code : '';

        return "{$businessSchemeCode}{$businessGradeCode}";
    }

    public function businessGrade()
    {
        return $this->belongsTo(BusinessGrade::class);
    }

    public function businessPost()
    {
        return $this->belongsTo(BusinessPost::class);
    }

    public function businessScheme()
    {
        return $this->belongsTo(BusinessScheme::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supervisors()
    {
        return $this->hasMany(Supervisor::class);
    }
}
