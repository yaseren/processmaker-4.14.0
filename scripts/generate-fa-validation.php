<?php

declare(strict_types=1);

$en = require __DIR__ . '/../resources/lang/en/validation.php';

$translate = static function ($text) {
    if (!is_string($text)) {
        return $text;
    }

    $replacements = [
        'The :Attribute field is required.' => 'فیلد :Attribute الزامی است.',
        'The selected :Attribute is invalid.' => ':Attribute انتخاب‌شده نامعتبر است.',
        'The :Attribute field must be a valid email address.' => 'فیلد :Attribute باید یک ایمیل معتبر باشد.',
        'The :Attribute field confirmation does not match.' => 'تأیید فیلد :Attribute مطابقت ندارد.',
        'The password is incorrect.' => 'رمز عبور نادرست است.',
        'The :Attribute has already been taken.' => ':Attribute قبلاً استفاده شده است.',
        'The :Attribute field must be a valid URL.' => 'فیلد :Attribute باید یک URL معتبر باشد.',
        'Invalid value specified for: :Attribute' => 'مقدار نامعتبر برای: :Attribute',
        'The category cannot be deleted while it is still assigned to processes.' =>
            'تا زمانی که این دسته‌بندی به فرایندها اختصاص دارد، قابل حذف نیست.',
        'The file has an incorrect extension. Please check the file and upload again.' =>
            'پسوند فایل نادرست است. لطفاً فایل را بررسی و دوباره بارگذاری کنید.',
        'The upload of php files was disabled.' => 'بارگذاری فایل‌های PHP غیرفعال است.',
        'You can not delete the template :path because it has a relationship with Email Event' =>
            'امکان حذف قالب :path وجود ندارد؛ به رویداد ایمیل مرتبط است.',
        'You can not delete the template :path because it is used as a routing screen.' =>
            'امکان حذف قالب :path وجود ندارد؛ به‌عنوان صفحه مسیریابی استفاده می‌شود.',
    ];

    if (isset($replacements[$text])) {
        return $replacements[$text];
    }

    $text = str_replace('The :Attribute field must be ', 'فیلد :Attribute باید ', $text);
    $text = str_replace('The :Attribute field must not ', 'فیلد :Attribute نباید ', $text);
    $text = str_replace('The :Attribute field ', 'فیلد :Attribute ', $text);
    $text = str_replace('The selected :Attribute ', ':Attribute انتخاب‌شده ', $text);
    $text = str_replace('The given :Attribute ', ':Attribute داده‌شده ', $text);

    return $text;
};

$walk = static function ($value) use (&$walk, $translate) {
    if (is_array($value)) {
        $out = [];
        foreach ($value as $key => $item) {
            $out[$key] = $walk($item);
        }

        return $out;
    }

    return $translate($value);
};

$fa = $walk($en);

$exportArray = static function (array $data, int $depth = 0) use (&$exportArray): string {
    $indent = str_repeat('    ', $depth);
    $inner = str_repeat('    ', $depth + 1);
    $lines = ["{$indent}["];

    foreach ($data as $key => $value) {
        $keyExport = is_int($key) ? (string) $key : "'" . str_replace("'", "\\'", (string) $key) . "'";
        if (is_array($value)) {
            $nested = $exportArray($value, $depth + 1);
            $lines[] = "{$inner}{$keyExport} => {$nested},";
        } else {
            $lines[] = "{$inner}{$keyExport} => '" . str_replace("'", "\\'", (string) $value) . "',";
        }
    }

    $lines[] = "{$indent}]";

    return implode("\n", $lines);
};

$content = "<?php\n\nreturn " . ltrim($exportArray($fa), "\n") . ";\n";
file_put_contents(__DIR__ . '/../resources/lang/fa/validation.php', $content);

echo "Wrote resources/lang/fa/validation.php\n";
