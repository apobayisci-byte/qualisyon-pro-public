"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function YoneticiPage() {
const [session, setSession] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

const [activeTab, setActiveTab] = useState("gallery");

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loginLoading, setLoginLoading] = useState(false);
const [loginMessage, setLoginMessage] = useState("");
const [panelMessage, setPanelMessage] = useState("");

const [gallery, setGallery] = useState([]);
const [galleryLoading, setGalleryLoading] = useState(false);

const [selectedFile, setSelectedFile] = useState(null);
const [selectedFileInfo, setSelectedFileInfo] = useState("");
const [imageTitle, setImageTitle] = useState("");
const [uploadLoading, setUploadLoading] = useState(false);

const [management, setManagement] = useState([]);
const [managementLoading, setManagementLoading] = useState(false);

const [managementName, setManagementName] = useState("");
const [managementRole, setManagementRole] = useState("");
const [managementSteam, setManagementSteam] = useState("");
const [managementDiscord, setManagementDiscord] = useState("");
const [managementSort, setManagementSort] = useState("");

const [managementAvatar, setManagementAvatar] = useState(null);
const [managementAvatarInfo, setManagementAvatarInfo] = useState("");
const [managementSaving, setManagementSaving] = useState(false);

const [servers, setServers] = useState([]);
const [serversLoading, setServersLoading] = useState(false);
const [serverEditingId, setServerEditingId] = useState(null);

const [serverName, setServerName] = useState("");
const [serverHost, setServerHost] = useState("");
const [serverPort, setServerPort] = useState("27015");
const [serverType, setServerType] = useState("public");
const [serverTs3, setServerTs3] = useState("");
const [serverSort, setServerSort] = useState("");
const [serverSaving, setServerSaving] = useState(false);

const [rules, setRules] = useState([]);
const [rulesLoading, setRulesLoading] = useState(false);

const [ruleGroup, setRuleGroup] = useState("server");
const [ruleContent, setRuleContent] = useState("");
const [ruleSaving, setRuleSaving] = useState(false);

const [supportRequests, setSupportRequests] = useState([]);
const [supportLoading, setSupportLoading] = useState(false);
const [supportFilter, setSupportFilter] = useState("all");
const [expandedSupportId, setExpandedSupportId] = useState(null);
const [supportActionId, setSupportActionId] = useState(null);

const [contactRecordId, setContactRecordId] = useState(null);
const [contactPhone, setContactPhone] = useState("");
const [contactDiscord, setContactDiscord] = useState("");
const [contactSteam, setContactSteam] = useState("");
const [contactTs3, setContactTs3] = useState("");
const [contactEmail, setContactEmail] = useState("");
const [contactDescription, setContactDescription] = useState("");
const [contactIsActive, setContactIsActive] = useState(true);
const [contactLoading, setContactLoading] = useState(false);
const [contactSaving, setContactSaving] = useState(false);

useEffect(() => {
let mounted = true;

async function getSession() {
const {
data: { session },
} = await supabase.auth.getSession();

if (!mounted) return;

setSession(session);
setAuthLoading(false);
}

getSession();

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, newSession) => {
setSession(newSession);
setAuthLoading(false);
});

return () => {
mounted = false;
subscription.unsubscribe();
};
}, []);

useEffect(() => {
if (!session) {
setGallery([]);
setManagement([]);
setServers([]);
setRules([]);
setSupportRequests([]);

setContactRecordId(null);
setContactPhone("");
setContactDiscord("");
setContactSteam("");
setContactTs3("");
setContactEmail("");
setContactDescription("");
setContactIsActive(true);

return;
}

loadGallery();
loadManagement();
loadServers();
loadRules();
loadSupportRequests();
loadContactSettings();
}, [session]);

useEffect(() => {
if (activeTab === "support" && session) {
loadSupportRequests();
}
}, [activeTab]);

useEffect(() => {
if (activeTab === "contact" && session) {
loadContactSettings();
}
}, [activeTab, session]);

async function handleLogin(event) {
event.preventDefault();

setLoginLoading(true);
setLoginMessage("");

const { error } = await supabase.auth.signInWithPassword({
email,
password,
});

if (error) {
setLoginMessage("E-posta veya şifre hatalı.");
setLoginLoading(false);
return;
}

setPassword("");
setLoginLoading(false);
}

async function handleLogout() {
await supabase.auth.signOut();
}

async function loadGallery() {
setGalleryLoading(true);

const { data, error } = await supabase
.from("gallery")
.select(
"id, image_url, storage_path, title, sort_order, is_active, created_at"
)
.order("sort_order", { ascending: true })
.order("created_at", { ascending: false });

if (error) {
console.error(error);
setPanelMessage("Galeri bilgileri alınamadı.");
setGalleryLoading(false);
return;
}

setGallery(data || []);
setGalleryLoading(false);
}

function handleFileChange(event) {
const file = event.target.files?.[0] || null;

setSelectedFile(null);
setSelectedFileInfo("");

if (!file) return;

if (!file.type.startsWith("image/")) {
event.target.value = "";
setPanelMessage("Sadece görsel dosyası yükleyebilirsin.");
return;
}

setSelectedFile(file);

const sizeMb = (file.size / 1024 / 1024).toFixed(2);

setSelectedFileInfo(`${file.name} • ${sizeMb} MB`);
}

async function handleUpload(event) {
event.preventDefault();

if (!selectedFile) {
setPanelMessage("Önce bir fotoğraf seç.");
return;
}

setUploadLoading(true);
setPanelMessage("");

try {
const extension =
selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";

const safeName =
`${Date.now()}-${crypto.randomUUID()}.${extension}`;

const storagePath = `uploads/${safeName}`;

const { error: uploadError } = await supabase.storage
.from("gallery")
.upload(storagePath, selectedFile, {
cacheControl: "3600",
upsert: false,
});

if (uploadError) {
throw uploadError;
}

const { data: publicData } = supabase.storage
.from("gallery")
.getPublicUrl(storagePath);

const nextOrder =
gallery.length > 0
? Math.max(...gallery.map((item) => item.sort_order || 0)) + 1
: 1;

const { error: insertError } =
await supabase.from("gallery").insert({
image_url: publicData.publicUrl,
storage_path: storagePath,
title: imageTitle.trim() || null,
sort_order: nextOrder,
is_active: true,
});

if (insertError) {
await supabase.storage
.from("gallery")
.remove([storagePath]);

throw insertError;
}

setSelectedFile(null);
setSelectedFileInfo("");
setImageTitle("");

const input =
document.getElementById("gallery-file");

if (input) {
input.value = "";
}

setPanelMessage(
"Fotoğraf başarıyla galeriye eklendi."
);

await loadGallery();
} catch (error) {
console.error(error);

setPanelMessage(
"Fotoğraf yüklenirken bir hata oluştu."
);
}

setUploadLoading(false);
}

async function toggleGalleryItem(item) {
const { error } = await supabase
.from("gallery")
.update({
is_active: !item.is_active,
})
.eq("id", item.id);

if (error) {
setPanelMessage(
"Fotoğraf durumu değiştirilemedi."
);
return;
}

await loadGallery();
}

async function deleteGalleryItem(item) {
const confirmed = window.confirm(
"Bu fotoğrafı kalıcı olarak silmek istediğine emin misin?"
);

if (!confirmed) return;

const { error } = await supabase
.from("gallery")
.delete()
.eq("id", item.id);

if (error) {
setPanelMessage("Fotoğraf silinemedi.");
return;
}

if (item.storage_path) {
await supabase.storage
.from("gallery")
.remove([item.storage_path]);
}

setPanelMessage("Fotoğraf silindi.");

await loadGallery();
}

async function loadManagement() {
setManagementLoading(true);

const { data, error } = await supabase
.from("management")
.select(
"id, name, role, steam_url, discord, avatar_url, avatar_storage_path, sort_order, is_active, created_at"
)
.order("sort_order", { ascending: true })
.order("created_at", { ascending: true });

if (error) {
console.error(error);

setPanelMessage("Yönetim kadrosu alınamadı.");
setManagementLoading(false);

return;
}

setManagement(data || []);
setManagementLoading(false);
}

function handleManagementAvatar(event) {
const file = event.target.files?.[0] || null;

setManagementAvatar(null);
setManagementAvatarInfo("");

if (!file) return;

if (!file.type.startsWith("image/")) {
event.target.value = "";
setPanelMessage(
"Avatar için görsel dosyası seç."
);
return;
}

setManagementAvatar(file);

const sizeMb =
(file.size / 1024 / 1024).toFixed(2);

setManagementAvatarInfo(
`${file.name} • ${sizeMb} MB`
);
}

async function handleManagementAdd(event) {
event.preventDefault();

if (
!managementName.trim() ||
!managementRole.trim()
) {
setPanelMessage(
"İsim ve rol zorunludur."
);
return;
}

setManagementSaving(true);
setPanelMessage("");

let avatarUrl = null;
let avatarStoragePath = null;

try {
if (managementAvatar) {
const extension =
managementAvatar.name
.split(".")
.pop()
?.toLowerCase() || "png";

avatarStoragePath =
`avatars/${Date.now()}-${crypto.randomUUID()}.${extension}`;

const { error: uploadError } =
await supabase.storage
.from("management")
.upload(
avatarStoragePath,
managementAvatar,
{
cacheControl: "3600",
upsert: false,
}
);

if (uploadError) {
throw uploadError;
}

const { data: publicData } =
supabase.storage
.from("management")
.getPublicUrl(
avatarStoragePath
);

avatarUrl =
publicData.publicUrl;
}

const nextOrder =
managementSort.trim() !== ""
? Number(managementSort)
: management.length > 0
? Math.max(
...management.map(
(item) =>
item.sort_order || 0
)
) + 1
: 1;

const { error: insertError } =
await supabase
.from("management")
.insert({
name:
managementName.trim(),

role:
managementRole.trim(),

steam_url:
managementSteam.trim() ||
null,

discord:
managementDiscord.trim() ||
null,

avatar_url:
avatarUrl,

avatar_storage_path:
avatarStoragePath,

sort_order:
nextOrder,

is_active:
true,
});

if (insertError) {
if (avatarStoragePath) {
await supabase.storage
.from("management")
.remove([
avatarStoragePath,
]);
}

throw insertError;
}

setManagementName("");
setManagementRole("");
setManagementSteam("");
setManagementDiscord("");
setManagementSort("");

setManagementAvatar(null);
setManagementAvatarInfo("");

const input =
document.getElementById(
"management-avatar"
);

if (input) {
input.value = "";
}

setPanelMessage(
"Yönetim üyesi başarıyla eklendi."
);

await loadManagement();
} catch (error) {
console.error(error);

setPanelMessage(
"Yönetim üyesi eklenirken hata oluştu."
);
}

setManagementSaving(false);
}

async function toggleManagementItem(item) {
const { error } = await supabase
.from("management")
.update({
is_active: !item.is_active,
})
.eq("id", item.id);

if (error) {
setPanelMessage(
"Yönetim üyesi durumu değiştirilemedi."
);
return;
}

await loadManagement();
}

async function deleteManagementItem(item) {
const confirmed = window.confirm(
`${item.name} adlı yönetim üyesini silmek istediğine emin misin?`
);

if (!confirmed) return;

const { error } = await supabase
.from("management")
.delete()
.eq("id", item.id);

if (error) {
setPanelMessage(
"Yönetim üyesi silinemedi."
);
return;
}

if (item.avatar_storage_path) {
await supabase.storage
.from("management")
.remove([
item.avatar_storage_path,
]);
}

setPanelMessage(
"Yönetim üyesi silindi."
);

await loadManagement();
}

async function loadServers() {
setServersLoading(true);

const { data, error } = await supabase
.from("servers")
.select(
"id, name, host, port, server_type, ts3_address, sort_order, is_active, created_at"
)
.order("sort_order", {
ascending: true,
})
.order("id", {
ascending: true,
});

if (error) {
console.error(error);

setPanelMessage(
"Sunucular alınamadı."
);

setServersLoading(false);

return;
}

setServers(data || []);
setServersLoading(false);
}

function resetServerForm() {
setServerEditingId(null);

setServerName("");
setServerHost("");
setServerPort("27015");

setServerType("public");
setServerTs3("");
setServerSort("");
}

function editServer(server) {
setServerEditingId(
server.id
);

setServerName(
server.name || ""
);

setServerHost(
server.host || ""
);

setServerPort(
String(
server.port || 27015
)
);

setServerType(
server.server_type ||
"public"
);

setServerTs3(
server.ts3_address || ""
);

setServerSort(
String(
server.sort_order ?? ""
)
);
}

async function saveServer(event) {
event.preventDefault();

if (
!serverName.trim() ||
!serverHost.trim()
) {
setPanelMessage(
"Sunucu adı ve IP zorunludur."
);
return;
}

setServerSaving(true);
setPanelMessage("");

const nextOrder =
serverSort.trim() !== ""
? Number(serverSort)
: servers.length > 0
? Math.max(
...servers.map(
(item) =>
item.sort_order || 0
)
) + 1
: 1;

const payload = {
name:
serverName.trim(),

host:
serverHost.trim(),

port:
Number(serverPort) ||
27015,

server_type:
serverType.trim() ||
"public",

ts3_address:
serverTs3.trim() ||
null,

sort_order:
nextOrder,

is_active:
true,
};

let error = null;

if (serverEditingId) {
const result =
await supabase
.from("servers")
.update(payload)
.eq(
"id",
serverEditingId
);

error =
result.error;
} else {
const result =
await supabase
.from("servers")
.insert(payload);

error =
result.error;
}

if (error) {
console.error(error);

setPanelMessage(
"Sunucu kaydedilemedi."
);

setServerSaving(false);

return;
}

setPanelMessage(
serverEditingId
? "Sunucu güncellendi."
: "Sunucu eklendi."
);

resetServerForm();

await loadServers();

setServerSaving(false);
}

async function toggleServer(server) {
const { error } =
await supabase
.from("servers")
.update({
is_active:
!server.is_active,
})
.eq(
"id",
server.id
);

if (error) {
setPanelMessage(
"Sunucu durumu değiştirilemedi."
);

return;
}

await loadServers();
}

async function deleteServer(server) {
const confirmed =
window.confirm(
`${server.name} silinsin mi?`
);

if (!confirmed) return;

const { error } =
await supabase
.from("servers")
.delete()
.eq(
"id",
server.id
);

if (error) {
setPanelMessage(
"Sunucu silinemedi."
);

return;
}

if (
serverEditingId ===
server.id
) {
resetServerForm();
}

setPanelMessage(
"Sunucu silindi."
);

await loadServers();
}

async function loadRules() {
setRulesLoading(true);

const { data, error } =
await supabase
.from("rules")
.select(
"id, rule_group, content, is_active, updated_at"
)
.order(
"rule_group",
{
ascending: true,
}
);

if (error) {
console.error(error);

setPanelMessage(
"Kurallar alınamadı."
);

setRulesLoading(false);

return;
}

setRules(data || []);
setRulesLoading(false);
}

useEffect(() => {
const record =
rules.find(
(item) =>
item.rule_group ===
ruleGroup
);

setRuleContent(
record?.content || ""
);
}, [ruleGroup, rules]);

async function saveRule(event) {
event.preventDefault();

if (!ruleContent.trim()) {
setPanelMessage(
"Kural metni boş olamaz."
);
return;
}

setRuleSaving(true);
setPanelMessage("");

const { error } =
await supabase
.from("rules")
.upsert(
{
rule_group:
ruleGroup,

content:
ruleContent,

is_active:
true,

updated_at:
new Date().toISOString(),
},
{
onConflict:
"rule_group",
}
);

if (error) {
console.error(error);

setPanelMessage(
"Kurallar kaydedilemedi."
);

setRuleSaving(false);

return;
}

setPanelMessage(
ruleGroup === "server"
? "Sunucu kuralları kaydedildi."
: "Admin kuralları kaydedildi."
);

await loadRules();

setRuleSaving(false);
}

async function toggleRuleGroup(group) {
const record =
rules.find(
(item) =>
item.rule_group ===
group
);

if (!record) {
setPanelMessage(
"Önce bu bölüm için kural kaydet."
);
return;
}

const { error } =
await supabase
.from("rules")
.update({
is_active:
!record.is_active,

updated_at:
new Date().toISOString(),
})
.eq(
"id",
record.id
);

if (error) {
setPanelMessage(
"Kural durumu değiştirilemedi."
);
return;
}

await loadRules();
}

async function deleteRuleGroup(group) {
const label =
group === "server"
? "Sunucu Kuralları"
: "Admin Kuralları";

const confirmed =
window.confirm(
`${label} tamamen silinsin mi?`
);

if (!confirmed) return;

const { error } =
await supabase
.from("rules")
.delete()
.eq(
"rule_group",
group
);

if (error) {
setPanelMessage(
"Kurallar silinemedi."
);
return;
}

if (ruleGroup === group) {
setRuleContent("");
}

setPanelMessage(
`${label} silindi.`
);

await loadRules();
}

async function loadSupportRequests() {
setSupportLoading(true);

const { data, error } =
await supabase
.from("support_requests")
.select(
"id, name, contact, request_type, subject, message, status, created_at"
)
.order(
"created_at",
{
ascending: false,
}
);

if (error) {
console.error(
"SUPPORT LOAD ERROR:",
error
);

setPanelMessage(
"Destek talepleri alınamadı."
);

setSupportLoading(false);

return;
}

setSupportRequests(
data || []
);

setSupportLoading(false);
}

function getSupportTypeLabel(type) {
const labels = {
ban_appeal:
"Ban İtirazı",

player_report:
"Oyuncu Şikayeti",

admin_report:
"Admin Şikayeti",

technical:
"Teknik Sorun",

other:
"Diğer",
};

return (
labels[type] ||
type
);
}

function getSupportStatusLabel(status) {
const labels = {
new:
"YENİ",

reviewing:
"İNCELENİYOR",

resolved:
"ÇÖZÜLDÜ",
};

return (
labels[status] ||
status
);
}

function formatSupportDate(value) {
if (!value) return "-";

try {
return new Intl.DateTimeFormat(
"tr-TR",
{
day:
"2-digit",

month:
"2-digit",

year:
"numeric",

hour:
"2-digit",

minute:
"2-digit",
}
).format(
new Date(value)
);
} catch {
return value;
}
}

async function updateSupportStatus(item, status) {
setSupportActionId(
item.id
);

setPanelMessage("");

const { error } =
await supabase
.from("support_requests")
.update({
status,
})
.eq(
"id",
item.id
);

if (error) {
console.error(error);

setPanelMessage(
"Destek talebi durumu değiştirilemedi."
);

setSupportActionId(null);

return;
}

if (status === "reviewing") {
setPanelMessage(
"Destek talebi inceleniyor olarak işaretlendi."
);
}

if (status === "resolved") {
setPanelMessage(
"Destek talebi çözüldü olarak işaretlendi."
);
}

if (status === "new") {
setPanelMessage(
"Destek talebi yeniden yeni durumuna alındı."
);
}

await loadSupportRequests();

setSupportActionId(null);
}

async function deleteSupportRequest(item) {
const confirmed =
window.confirm(
`${item.name} tarafından gönderilen destek talebi kalıcı olarak silinsin mi?`
);

if (!confirmed) return;

setSupportActionId(
item.id
);

setPanelMessage("");

const { error } =
await supabase
.from("support_requests")
.delete()
.eq(
"id",
item.id
);

if (error) {
console.error(error);

setPanelMessage(
"Destek talebi silinemedi."
);

setSupportActionId(null);

return;
}

if (
expandedSupportId ===
item.id
) {
setExpandedSupportId(null);
}

setPanelMessage(
"Destek talebi silindi."
);

await loadSupportRequests();

setSupportActionId(null);
}

const filteredSupportRequests =
supportFilter === "all"
? supportRequests
: supportRequests.filter(
(item) =>
item.status ===
supportFilter
);

const newSupportCount =
supportRequests.filter(
(item) =>
item.status === "new"
).length;

const reviewingSupportCount =
supportRequests.filter(
(item) =>
item.status ===
"reviewing"
).length;

const resolvedSupportCount =
supportRequests.filter(
(item) =>
item.status ===
"resolved"
).length;

async function loadContactSettings() {
setContactLoading(true);

const { data, error } =
await supabase
.from("contact_settings")
.select(
"id, phone, discord, steam_url, ts3_address, email, description, is_active, updated_at"
)
.order("id", {
ascending: true,
})
.limit(1)
.maybeSingle();

if (error) {
console.error(
"CONTACT LOAD ERROR:",
error
);

setPanelMessage(
"İletişim bilgileri alınamadı."
);

setContactLoading(false);

return;
}

setContactRecordId(
data?.id || null
);

setContactPhone(
data?.phone || ""
);

setContactDiscord(
data?.discord || ""
);

setContactSteam(
data?.steam_url || ""
);

setContactTs3(
data?.ts3_address || ""
);

setContactEmail(
data?.email || ""
);

setContactDescription(
data?.description || ""
);

setContactIsActive(
data?.is_active ?? true
);

setContactLoading(false);
}

async function saveContactSettings(event) {
event.preventDefault();

setContactSaving(true);
setPanelMessage("");

const payload = {
phone:
contactPhone.trim() ||
null,

discord:
contactDiscord.trim() ||
null,

steam_url:
contactSteam.trim() ||
null,

ts3_address:
contactTs3.trim() ||
null,

email:
contactEmail.trim() ||
null,

description:
contactDescription.trim() ||
null,

is_active:
contactIsActive,

updated_at:
new Date().toISOString(),
};

let error = null;

if (contactRecordId) {
const result =
await supabase
.from("contact_settings")
.update(payload)
.eq(
"id",
contactRecordId
);

error =
result.error;
} else {
const result =
await supabase
.from("contact_settings")
.insert(payload)
.select("id")
.single();

error =
result.error;

if (
!error &&
result.data?.id
) {
setContactRecordId(
result.data.id
);
}
}

if (error) {
console.error(
"CONTACT SAVE ERROR:",
error
);

setPanelMessage(
"İletişim bilgileri kaydedilemedi."
);

setContactSaving(false);

return;
}

setPanelMessage(
"İletişim bilgileri kaydedildi."
);

await loadContactSettings();

setContactSaving(false);
}

if (authLoading) {
return (
<main className="admin-page">
<div className="admin-loading">
Yükleniyor...
</div>
</main>
);
}

if (!session) {
return (
<main className="admin-page">

<div className="admin-login-wrap">

<div className="admin-login-box">

<div className="admin-login-brand">
<img
src="/cs-logo.png"
alt=""
/>

<div>
<strong>
QUALISYON
</strong>

<span>
YÖNETİCİ PANELİ
</span>
</div>
</div>

<div className="admin-login-line"></div>

<h1>
YÖNETİCİ GİRİŞİ
</h1>

<p>
Yönetim paneline erişmek için hesabınla giriş yap.
</p>

<form
className="admin-login-form"
onSubmit={handleLogin}
>

<label>
E-POSTA

<input
type="email"
value={email}
onChange={(event) =>
setEmail(
event.target.value
)
}
required
/>
</label>

<label>
ŞİFRE

<input
type="password"
value={password}
onChange={(event) =>
setPassword(
event.target.value
)
}
required
/>
</label>

{loginMessage && (
<div className="admin-error-message">
{loginMessage}
</div>
)}

<button
className="admin-primary-button"
disabled={loginLoading}
>
{loginLoading
? "GİRİŞ YAPILIYOR..."
: "GİRİŞ YAP"}
</button>

</form>

<a
href="/"
className="admin-back-link"
>
Siteye Dön
</a>

</div>
</div>
</main>
);
}

const serverRules =
rules.find(
(item) =>
item.rule_group ===
"server"
);

const adminRules =
rules.find(
(item) =>
item.rule_group ===
"admin"
);

return (
<main className="admin-page">

<header className="admin-header">

<div className="admin-header-brand">
<img
src="/cs-logo.png"
alt=""
/>

<div>
<strong>
QUALISYON
</strong>

<span>
YÖNETİCİ PANELİ
</span>
</div>
</div>

<div className="admin-header-actions">

<a
href="/"
className="admin-secondary-button"
>
SİTEYİ GÖRÜNTÜLE
</a>

<button
type="button"
className="admin-secondary-button"
onClick={handleLogout}
>
ÇIKIŞ YAP
</button>

</div>

</header>

<div className="admin-layout">

<aside className="admin-sidebar">

<div className="admin-sidebar-title">
YÖNETİM
</div>

<button
className={`admin-menu-item ${
activeTab === "gallery"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("gallery");
}}
>
Galeri
</button>

<button
className={`admin-menu-item ${
activeTab === "management"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("management");
}}
>
Yönetim Kadrosu
</button>

<button
className={`admin-menu-item ${
activeTab === "servers"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("servers");
}}
>
Sunucular
</button>

<button
className={`admin-menu-item ${
activeTab === "rules"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("rules");
}}
>
Kurallar
</button>

<button
className={`admin-menu-item ${
activeTab === "support"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("support");
}}
>
Destek

{newSupportCount > 0 && (
<span className="admin-support-menu-count">
{newSupportCount}
</span>
)}
</button>

<button
className={`admin-menu-item ${
activeTab === "contact"
? "active"
: ""
}`}
onClick={() => {
setPanelMessage("");
setActiveTab("contact");
}}
>
İletişim
</button>



</aside>

<section className="admin-content">

{panelMessage && (
<div className="admin-panel-message">
{panelMessage}
</div>
)}

{activeTab === "gallery" && (
<>

<div className="admin-section-heading">
<span>QUALISYON</span>
<h1>GALERİ YÖNETİMİ</h1>
</div>

<div className="admin-card">

<div className="admin-card-heading">
<span>YENİ FOTOĞRAF</span>
<h2>Galeriye Fotoğraf Ekle</h2>
</div>

<form
className="gallery-upload-form"
onSubmit={handleUpload}
>

<label className="admin-field">
<span>FOTOĞRAF</span>

<input
id="gallery-file"
type="file"
accept="image/*"
onChange={handleFileChange}
/>

{selectedFileInfo && (
<small className="selected-file-info">
{selectedFileInfo}
</small>
)}
</label>

<label className="admin-field">
<span>BAŞLIK</span>

<input
value={imageTitle}
onChange={(event) =>
setImageTitle(
event.target.value
)
}
placeholder="İsteğe bağlı"
/>
</label>

<button
className="admin-primary-button"
disabled={
uploadLoading ||
!selectedFile
}
>
{uploadLoading
? "YÜKLENİYOR..."
: "FOTOĞRAFI YÜKLE"}
</button>

</form>

</div>

<div className="admin-card">

<div className="admin-card-heading admin-card-heading-row">

<div>
<span>GALERİ</span>
<h2>Yüklü Fotoğraflar</h2>
</div>

<strong className="gallery-total">
{gallery.length} FOTOĞRAF
</strong>

</div>

{galleryLoading ? (
<div className="admin-empty">
Galeri yükleniyor...
</div>
) : gallery.length === 0 ? (
<div className="admin-empty">
Henüz fotoğraf eklenmedi.
</div>
) : (
<div className="admin-gallery-grid">

{gallery.map((item) => (
<div
key={item.id}
className={`admin-gallery-item ${
!item.is_active
? "inactive"
: ""
}`}
>

<div className="admin-gallery-image">
<img
src={item.image_url}
alt=""
/>
</div>

<div className="admin-gallery-info">

<strong>
{item.title ||
"Başlıksız Fotoğraf"}
</strong>

<small>
Sıra: {item.sort_order}
</small>

<div className="admin-gallery-actions">

<button
type="button"
className="admin-small-button"
onClick={() =>
toggleGalleryItem(item)
}
>
{item.is_active
? "GİZLE"
: "YAYINLA"}
</button>

<button
type="button"
className="admin-small-button danger"
onClick={() =>
deleteGalleryItem(item)
}
>
SİL
</button>

</div>
</div>
</div>
))}

</div>
)}

</div>

</>
)}

{activeTab === "management" && (
<>

<div className="admin-section-heading">

<span>
QUALISYON
</span>

<h1>
YÖNETİM KADROSU
</h1>

<p>
Yönetim üyelerini buradan ekleyebilir, gizleyebilir ve silebilirsin.
</p>

</div>

<div className="admin-card">

<div className="admin-card-heading">
<span>YENİ ÜYE</span>
<h2>Yönetim Üyesi Ekle</h2>
</div>

<form
className="management-admin-form"
onSubmit={handleManagementAdd}
>

<label className="admin-field">

<span>
AVATAR / LOGO
</span>

<input
id="management-avatar"
type="file"
accept="image/*"
onChange={handleManagementAvatar}
/>

{managementAvatarInfo && (
<small className="selected-file-info">
{managementAvatarInfo}
</small>
)}

</label>

<label className="admin-field">
<span>İSİM</span>

<input
value={managementName}
onChange={(event) =>
setManagementName(
event.target.value
)
}
required
/>
</label>

<label className="admin-field">
<span>ROL / YETKİ</span>

<input
value={managementRole}
onChange={(event) =>
setManagementRole(
event.target.value
)
}
required
/>
</label>

<label className="admin-field">
<span>STEAM</span>

<input
value={managementSteam}
onChange={(event) =>
setManagementSteam(
event.target.value
)
}
/>
</label>

<label className="admin-field">
<span>DISCORD</span>

<input
value={managementDiscord}
onChange={(event) =>
setManagementDiscord(
event.target.value
)
}
/>
</label>

<label className="admin-field">
<span>SIRA</span>

<input
type="number"
value={managementSort}
onChange={(event) =>
setManagementSort(
event.target.value
)
}
placeholder="Otomatik"
/>
</label>

<button
className="admin-primary-button management-save-button"
disabled={managementSaving}
>
{managementSaving
? "EKLENİYOR..."
: "YÖNETİME EKLE"}
</button>

</form>

</div>

<div className="admin-card">

<div className="admin-card-heading admin-card-heading-row">

<div>
<span>YÖNETİM</span>
<h2>Yönetim Üyeleri</h2>
</div>

<strong className="gallery-total">
{management.length} KİŞİ
</strong>

</div>

{managementLoading ? (
<div className="admin-empty">
Yönetim yükleniyor...
</div>
) : management.length === 0 ? (
<div className="admin-empty">
Henüz yönetim üyesi eklenmedi.
</div>
) : (
<div className="admin-management-grid">

{management.map((item) => (
<div
key={item.id}
className={`admin-management-item ${
!item.is_active
? "inactive"
: ""
}`}
>

<div className="admin-management-preview">

<div className="admin-management-avatar">
<img
src={
item.avatar_url ||
"/cs-logo.png"
}
alt=""
/>
</div>

<div>

<span className="admin-management-role">
{item.role}
</span>

<strong>
{item.name}
</strong>

<small>
Sıra: {item.sort_order}
</small>

</div>

</div>

<div className="admin-management-actions">

<button
type="button"
className="admin-small-button"
onClick={() =>
toggleManagementItem(
item
)
}
>
{item.is_active
? "GİZLE"
: "YAYINLA"}
</button>

<button
type="button"
className="admin-small-button danger"
onClick={() =>
deleteManagementItem(
item
)
}
>
SİL
</button>

</div>

</div>
))}

</div>
)}

</div>

</>
)}

{activeTab === "servers" && (
<>

<div className="admin-section-heading">

<span>QUALISYON</span>

<h1>
SUNUCU YÖNETİMİ
</h1>

<p>
Public ve Match sunucularını buradan yönetebilirsin.
</p>

</div>

<div className="admin-card">

<div className="admin-card-heading">

<span>
{serverEditingId
? "SUNUCU DÜZENLE"
: "YENİ SUNUCU"}
</span>

<h2>
{serverEditingId
? "Sunucu Bilgilerini Güncelle"
: "Sunucu Ekle"}
</h2>

</div>

<form
className="server-admin-form"
onSubmit={saveServer}
>

<label className="admin-field">
<span>SUNUCU ADI</span>

<input
value={serverName}
onChange={(event) =>
setServerName(
event.target.value
)
}
required
/>
</label>

<label className="admin-field">
<span>IP</span>

<input
value={serverHost}
onChange={(event) =>
setServerHost(
event.target.value
)
}
required
/>
</label>

<label className="admin-field">
<span>PORT</span>

<input
type="number"
value={serverPort}
onChange={(event) =>
setServerPort(
event.target.value
)
}
/>
</label>

<label className="admin-field">
<span>TÜR</span>

<input
value={serverType}
onChange={(event) =>
setServerType(
event.target.value
)
}
/>
</label>

<label className="admin-field">
<span>TS3 ADRESİ</span>

<input
value={serverTs3}
onChange={(event) =>
setServerTs3(
event.target.value
)
}
/>
</label>

<label className="admin-field">
<span>SIRA</span>

<input
type="number"
value={serverSort}
onChange={(event) =>
setServerSort(
event.target.value
)
}
placeholder="Otomatik"
/>
</label>

<div className="server-admin-form-actions">

<button
className="admin-primary-button"
disabled={serverSaving}
>
{serverSaving
? "KAYDEDİLİYOR..."
: serverEditingId
? "SUNUCUYU GÜNCELLE"
: "SUNUCU EKLE"}
</button>

{serverEditingId && (
<button
type="button"
className="admin-secondary-button"
onClick={resetServerForm}
>
İPTAL
</button>
)}

</div>

</form>

</div>

<div className="admin-card">

<div className="admin-card-heading admin-card-heading-row">

<div>
<span>SUNUCULAR</span>
<h2>Kayıtlı Sunucular</h2>
</div>

<strong className="gallery-total">
{servers.length} SUNUCU
</strong>

</div>

{serversLoading ? (
<div className="admin-empty">
Sunucular yükleniyor...
</div>
) : servers.length === 0 ? (
<div className="admin-empty">
Henüz sunucu eklenmedi.
</div>
) : (
<div className="admin-server-grid">

{servers.map((server) => (
<div
key={server.id}
className={`admin-server-item ${
!server.is_active
? "inactive"
: ""
}`}
>

<div>

<span className="admin-management-role">
{server.server_type}
</span>

<strong>
{server.name}
</strong>

<small>
{server.host}:{server.port}
</small>

<small>
Sıra: {server.sort_order}
</small>

</div>

<div className="admin-server-actions">

<button
type="button"
className="admin-small-button"
onClick={() =>
editServer(server)
}
>
DÜZENLE
</button>

<button
type="button"
className="admin-small-button"
onClick={() =>
toggleServer(server)
}
>
{server.is_active
? "GİZLE"
: "YAYINLA"}
</button>

<button
type="button"
className="admin-small-button danger"
onClick={() =>
deleteServer(server)
}
>
SİL
</button>

</div>
</div>
))}

</div>
)}

</div>

</>
)}

{activeTab === "rules" && (
<>

<div className="admin-section-heading">

<span>YÖNETİM</span>

<h1>
KURAL YÖNETİMİ
</h1>

<p>
Metni nasıl yazdıysan siteye aynı şekilde aktarılır.
</p>

</div>

<div className="admin-card">

<div className="admin-card-heading">

<span>
KURAL METNİ
</span>

<h2>
{ruleGroup === "server"
? "Sunucu Kuralları"
: "Admin Kuralları"}
</h2>

</div>

<div className="rules-editor-tabs">

<button
type="button"
className={
ruleGroup === "server"
? "active"
: ""
}
onClick={() =>
setRuleGroup("server")
}
>
SUNUCU KURALLARI
</button>

<button
type="button"
className={
ruleGroup === "admin"
? "active"
: ""
}
onClick={() =>
setRuleGroup("admin")
}
>
ADMIN KURALLARI
</button>

</div>

<form
className="simple-rules-form"
onSubmit={saveRule}
>

<label className="admin-field">

<span>
METNİ BURAYA YAPIŞTIR
</span>

<textarea
className="simple-rules-textarea"
value={ruleContent}
onChange={(event) =>
setRuleContent(
event.target.value
)
}
/>

</label>

<div className="simple-rules-actions">

<button
className="admin-primary-button"
disabled={ruleSaving}
>
{ruleSaving
? "KAYDEDİLİYOR..."
: "KURALLARI KAYDET"}
</button>

</div>

</form>

</div>

<div className="admin-card">

<div className="admin-card-heading">
<span>DURUMLAR</span>
<h2>Kayıtlı Kural Metinleri</h2>
</div>

{rulesLoading ? (
<div className="admin-empty">
Kurallar yükleniyor...
</div>
) : (
<div className="simple-rule-status-grid">

<div
className={`simple-rule-status-card ${
serverRules &&
!serverRules.is_active
? "inactive"
: ""
}`}
>

<span>
SUNUCU KURALLARI
</span>

<strong>
{serverRules
? serverRules.is_active
? "YAYINDA"
: "GİZLİ"
: "EKLENMEDİ"}
</strong>

<div className="simple-rule-status-actions">

<button
type="button"
className="admin-small-button"
onClick={() =>
setRuleGroup("server")
}
>
DÜZENLE
</button>

{serverRules && (
<>

<button
type="button"
className="admin-small-button"
onClick={() =>
toggleRuleGroup(
"server"
)
}
>
{serverRules.is_active
? "GİZLE"
: "YAYINLA"}
</button>

<button
type="button"
className="admin-small-button danger"
onClick={() =>
deleteRuleGroup(
"server"
)
}
>
SİL
</button>

</>
)}

</div>

</div>

<div
className={`simple-rule-status-card ${
adminRules &&
!adminRules.is_active
? "inactive"
: ""
}`}
>

<span>
ADMIN KURALLARI
</span>

<strong>
{adminRules
? adminRules.is_active
? "YAYINDA"
: "GİZLİ"
: "EKLENMEDİ"}
</strong>

<div className="simple-rule-status-actions">

<button
type="button"
className="admin-small-button"
onClick={() =>
setRuleGroup("admin")
}
>
DÜZENLE
</button>

{adminRules && (
<>

<button
type="button"
className="admin-small-button"
onClick={() =>
toggleRuleGroup(
"admin"
)
}
>
{adminRules.is_active
? "GİZLE"
: "YAYINLA"}
</button>

<button
type="button"
className="admin-small-button danger"
onClick={() =>
deleteRuleGroup(
"admin"
)
}
>
SİL
</button>

</>
)}

</div>

</div>

</div>
)}

</div>

</>
)}

{activeTab === "support" && (
<>

<div className="admin-section-heading">

<span>
DESTEK MERKEZİ
</span>

<h1>
DESTEK TALEPLERİ
</h1>

<p>
Kullanıcıların gönderdiği destek taleplerini buradan yönetebilirsin.
</p>

</div>

<div className="admin-support-stats">

<button
type="button"
className={`admin-support-stat ${
supportFilter === "all"
? "active"
: ""
}`}
onClick={() =>
setSupportFilter("all")
}
>
<span>TOPLAM</span>
<strong>
{supportRequests.length}
</strong>
</button>

<button
type="button"
className={`admin-support-stat new ${
supportFilter === "new"
? "active"
: ""
}`}
onClick={() =>
setSupportFilter("new")
}
>
<span>YENİ</span>
<strong>
{newSupportCount}
</strong>
</button>

<button
type="button"
className={`admin-support-stat reviewing ${
supportFilter ===
"reviewing"
? "active"
: ""
}`}
onClick={() =>
setSupportFilter(
"reviewing"
)
}
>
<span>
İNCELENİYOR
</span>

<strong>
{reviewingSupportCount}
</strong>
</button>

<button
type="button"
className={`admin-support-stat resolved ${
supportFilter ===
"resolved"
? "active"
: ""
}`}
onClick={() =>
setSupportFilter(
"resolved"
)
}
>
<span>
ÇÖZÜLDÜ
</span>

<strong>
{resolvedSupportCount}
</strong>
</button>

</div>

<div className="admin-card">

<div className="admin-card-heading admin-card-heading-row">

<div>

<span>
TALEPLER
</span>

<h2>
{supportFilter === "all"
? "Tüm Destek Talepleri"
: supportFilter === "new"
? "Yeni Talepler"
: supportFilter ===
"reviewing"
? "İncelenen Talepler"
: "Çözülen Talepler"}
</h2>

</div>

<button
type="button"
className="admin-secondary-button"
onClick={loadSupportRequests}
disabled={supportLoading}
>
{supportLoading
? "YENİLENİYOR..."
: "YENİLE"}
</button>

</div>

{supportLoading ? (
<div className="admin-empty">
Destek talepleri yükleniyor...
</div>
) : filteredSupportRequests.length === 0 ? (
<div className="admin-empty">
Bu bölümde destek talebi bulunmuyor.
</div>
) : (
<div className="admin-support-list">

{filteredSupportRequests.map((item) => {
const expanded =
expandedSupportId ===
item.id;

const actionLoading =
supportActionId ===
item.id;

return (
<article
key={item.id}
className={`admin-support-ticket ${item.status}`}
>

<div className="admin-support-ticket-head">

<div className="admin-support-ticket-main">

<div className="admin-support-ticket-badges">

<span
className={`admin-support-status ${item.status}`}
>
{getSupportStatusLabel(
item.status
)}
</span>

<span className="admin-support-type">
{getSupportTypeLabel(
item.request_type
)}
</span>

</div>

<h3>
{item.subject}
</h3>

<div className="admin-support-meta">

<span>
{item.name}
</span>

<span>
•
</span>

<span>
{formatSupportDate(
item.created_at
)}
</span>

</div>

</div>

<button
type="button"
className="admin-support-open-button"
onClick={() =>
setExpandedSupportId(
expanded
? null
: item.id
)
}
>
{expanded
? "KAPAT"
: "GÖRÜNTÜLE"}
</button>

</div>

{expanded && (
<div className="admin-support-ticket-body">

<div className="admin-support-info-grid">

<div>
<small>
İSİM / NICK
</small>

<strong>
{item.name}
</strong>
</div>

<div>
<small>
İLETİŞİM
</small>

<strong>
{item.contact}
</strong>
</div>

<div>
<small>
TALEP TÜRÜ
</small>

<strong>
{getSupportTypeLabel(
item.request_type
)}
</strong>
</div>

<div>
<small>
TARİH
</small>

<strong>
{formatSupportDate(
item.created_at
)}
</strong>
</div>

</div>

<div className="admin-support-message">

<small>
AÇIKLAMA
</small>

<p>
{item.message}
</p>

</div>

<div className="admin-support-ticket-actions">

{item.status !==
"new" && (
<button
type="button"
className="admin-small-button"
disabled={
actionLoading
}
onClick={() =>
updateSupportStatus(
item,
"new"
)
}
>
YENİ YAP
</button>
)}

{item.status !==
"reviewing" && (
<button
type="button"
className="admin-small-button"
disabled={
actionLoading
}
onClick={() =>
updateSupportStatus(
item,
"reviewing"
)
}
>
İNCELENİYOR
</button>
)}

{item.status !==
"resolved" && (
<button
type="button"
className="admin-small-button support-resolve"
disabled={
actionLoading
}
onClick={() =>
updateSupportStatus(
item,
"resolved"
)
}
>
ÇÖZÜLDÜ
</button>
)}

<button
type="button"
className="admin-small-button danger"
disabled={
actionLoading
}
onClick={() =>
deleteSupportRequest(
item
)
}
>
SİL
</button>

</div>

</div>
)}

</article>
);
})}

</div>
)}

</div>

</>
)}

{activeTab === "contact" && (
<>

<div className="admin-section-heading">

<span>
QUALISYON
</span>

<h1>
İLETİŞİM YÖNETİMİ
</h1>

<p>
Sitedeki iletişim bilgilerini buradan değiştirebilirsin.
Boş bıraktığın alanlar public sayfada gösterilmez.
</p>

</div>

<div className="admin-card">

<div className="admin-card-heading">

<span>
İLETİŞİM BİLGİLERİ
</span>

<h2>
İletişim Kanallarını Düzenle
</h2>

</div>

{contactLoading ? (
<div className="admin-empty">
İletişim bilgileri yükleniyor...
</div>
) : (
<form
className="contact-admin-form"
onSubmit={saveContactSettings}
>

<label className="admin-field">
<span>
TELEFON
</span>

<input
type="text"
value={contactPhone}
onChange={(event) =>
setContactPhone(
event.target.value
)
}
placeholder="Örn: +90 555 555 55 55"
/>
</label>

<label className="admin-field">
<span>
DISCORD
</span>

<input
type="text"
value={contactDiscord}
onChange={(event) =>
setContactDiscord(
event.target.value
)
}
placeholder="Kullanıcı adı veya https://discord.gg/..."
/>
</label>

<label className="admin-field">
<span>
STEAM URL
</span>

<input
type="url"
value={contactSteam}
onChange={(event) =>
setContactSteam(
event.target.value
)
}
placeholder="https://steamcommunity.com/..."
/>
</label>

<label className="admin-field">
<span>
TEAMSPEAK 3
</span>

<input
type="text"
value={contactTs3}
onChange={(event) =>
setContactTs3(
event.target.value
)
}
placeholder="Örn: qlspro"
/>
</label>

<label className="admin-field">
<span>
E-POSTA
</span>

<input
type="email"
value={contactEmail}
onChange={(event) =>
setContactEmail(
event.target.value
)
}
placeholder="iletisim@ornek.com"
/>
</label>

<label className="admin-field contact-admin-description">

<span>
AÇIKLAMA
</span>

<textarea
value={contactDescription}
onChange={(event) =>
setContactDescription(
event.target.value
)
}
maxLength={500}
placeholder="İletişim bölümünde gösterilecek kısa açıklama"
/>

</label>

<label className="contact-admin-toggle">

<input
type="checkbox"
checked={contactIsActive}
onChange={(event) =>
setContactIsActive(
event.target.checked
)
}
/>

<span>
İletişim bilgilerini sitede yayınla
</span>

</label>

<button
className="admin-primary-button contact-admin-save"
disabled={contactSaving}
>
{contactSaving
? "KAYDEDİLİYOR..."
: "BİLGİLERİ KAYDET"}
</button>

</form>
)}

</div>

</>
)}

</section>

</div>

</main>
);
}