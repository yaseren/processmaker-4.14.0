const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const enPath = path.join(root, "resources/lang/en.json");
const faPath = path.join(root, "resources/lang/fa.json");
const glossaryPath = path.join(__dirname, "fa-glossary.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const glossary = fs.existsSync(glossaryPath)
  ? JSON.parse(fs.readFileSync(glossaryPath, "utf8"))
  : {};

const preserveTokens = (text, transform) => {
  const tokens = [];
  let index = 0;
  const placeholder = text.replace(/(\{\{[^}]+\}\}|:[a-zA-Z0-9_]+|\[\[[^\]]+\]\])/g, (match) => {
    const key = `__TOKEN_${index}__`;
    tokens.push({ key, match });
    index += 1;
    return key;
  });

  let translated = transform(placeholder);
  tokens.forEach(({ key, match }) => {
    translated = translated.split(key).join(match);
  });

  return translated;
};

const phraseReplacements = [
  ["ProcessMaker", "ProcessMaker"],
  ["Welcome", "خوش آمدید"],
  ["Login", "ورود"],
  ["Log in", "ورود"],
  ["Logout", "خروج"],
  ["Log out", "خروج"],
  ["Username", "نام کاربری"],
  ["Password", "رمز عبور"],
  ["Email", "ایمیل"],
  ["Save", "ذخیره"],
  ["Cancel", "لغو"],
  ["Delete", "حذف"],
  ["Edit", "ویرایش"],
  ["Create", "ایجاد"],
  ["Add", "افزودن"],
  ["Remove", "حذف"],
  ["Search", "جستجو"],
  ["Filter", "فیلتر"],
  ["Actions", "عملیات"],
  ["Active", "فعال"],
  ["Inactive", "غیرفعال"],
  ["Status", "وضعیت"],
  ["Name", "نام"],
  ["Description", "توضیحات"],
  ["Settings", "تنظیمات"],
  ["Profile", "پروفایل"],
  ["Users", "کاربران"],
  ["User", "کاربر"],
  ["Groups", "گروه‌ها"],
  ["Group", "گروه"],
  ["Processes", "فرایندها"],
  ["Process", "فرایند"],
  ["Tasks", "وظایف"],
  ["Task", "وظیفه"],
  ["Requests", "درخواست‌ها"],
  ["Request", "درخواست"],
  ["Screens", "صفحات"],
  ["Screen", "صفحه"],
  ["Scripts", "اسکریپت‌ها"],
  ["Script", "اسکریپت"],
  ["Categories", "دسته‌بندی‌ها"],
  ["Category", "دسته‌بندی"],
  ["Notifications", "اعلان‌ها"],
  ["Notification", "اعلان"],
  ["Advanced", "پیشرفته"],
  ["Close", "بستن"],
  ["Open", "باز کردن"],
  ["Submit", "ارسال"],
  ["Continue", "ادامه"],
  ["Back", "بازگشت"],
  ["Next", "بعدی"],
  ["Previous", "قبلی"],
  ["Yes", "بله"],
  ["No", "خیر"],
  ["Loading", "در حال بارگذاری"],
  ["Error", "خطا"],
  ["Success", "موفق"],
  ["Warning", "هشدار"],
  ["Required", "الزامی"],
  ["Optional", "اختیاری"],
  ["Admin", "مدیر"],
  ["Administrator", "مدیر سیستم"],
  ["About", "درباره"],
  ["Help", "راهنما"],
  ["Language", "زبان"],
  ["Timezone", "منطقه زمانی"],
  ["Date", "تاریخ"],
  ["Time", "زمان"],
  ["Export", "خروجی"],
  ["Import", "ورودی"],
  ["Download", "دانلود"],
  ["Upload", "بارگذاری"],
  ["Preview", "پیش‌نمایش"],
  ["Publish", "انتشار"],
  ["Draft", "پیش‌نویس"],
  ["Published", "منتشر شده"],
  ["Completed", "تکمیل شده"],
  ["In Progress", "در حال انجام"],
  ["Pending", "در انتظار"],
  ["No results", "نتیجه‌ای یافت نشد"],
  ["Are you sure?", "آیا مطمئن هستید؟"],
];

const translateValue = (key, value) => {
  if (glossary[key]) {
    return glossary[key];
  }
  if (glossary[value]) {
    return glossary[value];
  }

  if (key === value) {
    return preserveTokens(value, (text) => {
      let out = text;
      phraseReplacements.forEach(([from, to]) => {
        out = out.split(from).join(to);
      });
      return out;
    });
  }

  return preserveTokens(value, (text) => {
    let out = text;
    phraseReplacements.forEach(([from, to]) => {
      out = out.split(from).join(to);
    });
    return out;
  });
};

const fa = {};
Object.keys(en).forEach((key) => {
  fa[key] = translateValue(key, en[key]);
});

fs.writeFileSync(faPath, `${JSON.stringify(fa, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(fa).length} keys to ${faPath}`);
