// FlagQuest tasarım sistemi — bileşen tipleri.
// Global: window.FlagQuest. Paket olarak tüketirken `import * as FlagQuest from "flagquest-ds"`.
import * as React from "react";

/** Mod ve kategori renkleri. Durum bildirimi için KULLANILMAZ. */
export type MarkaRengi = "altin" | "damga" | "vize" | "meridyen" | "erguvan" | "bozkir";

export interface ButonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** birincil: sayfada tek bir tane. tehlike: yalnız yıkıcı işlem. Varsayılan "birincil". */
  cesit?: "birincil" | "ikincil" | "hayalet" | "tehlike";
  /** Varsayılan "md". Dokunmatik hedef için mobilde "lg". */
  boyut?: "sm" | "md" | "lg";
  tamGenislik?: boolean;
  /** Metinden önce gelen ikon düğümü (tüketici sağlar; lucide-react). */
  ikon?: React.ReactNode;
  /** Metinden sonra gelen ikon düğümü. */
  ikonSon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Buton(props: ButonProps): React.ReactElement;

export interface EtiketProps extends React.HTMLAttributes<HTMLSpanElement> {
  renk?: MarkaRengi;
  children?: React.ReactNode;
}
export declare function Etiket(props: EtiketProps): React.ReactElement;

export interface ModKartiProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** 20–24px ikon düğümü; tüketici sağlar. */
  ikon: React.ReactNode;
  baslik: string;
  /** Tek satır; taşan kısım kırpılır. */
  aciklama: string;
  /** Kısa üst etiket: "POPÜLER", "CANLI". */
  etiket?: string;
  /** Modun kategori rengi. Bkz. README'deki mod → renk eşlemesi. */
  renk?: MarkaRengi;
}
export declare function ModKarti(props: ModKartiProps): React.ReactElement;

export interface BayrakKartiProps extends React.HTMLAttributes<HTMLElement> {
  /** Bayrak görselinin URL'si; tüketici sağlar (uygulamada flagcdn). */
  src: string;
  /** Soru ekranında boş bırakılır — cevabı sızdırmasın. */
  alt?: string;
  /** Dedektif modunun ipucu kademeleri. Varsayılan "net". */
  durum?: "net" | "bulanik1" | "bulanik2";
  /** Bulanık kademelerde örtünün üstündeki metin. */
  ortuMetni?: string;
  /** Görselin altındaki belge satırı (bölge, kod). */
  altBilgi?: React.ReactNode;
}
export declare function BayrakKarti(props: BayrakKartiProps): React.ReactElement;

export interface SikButonuProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** "A"–"D". Klavye kısayolunu da temsil eder. */
  harf?: string;
  /** "elendi" 50:50 jokeriyle elenen şıktır ve tıklanamaz. Varsayılan "bos". */
  durum?: "bos" | "secili" | "dogru" | "yanlis" | "elendi";
  children?: React.ReactNode;
}
export declare function SikButonu(props: SikButonuProps): React.ReactElement;

export interface DamgaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ISO 3166-1 alpha-2, küçük harf ("tr"). */
  ulkeKodu: string;
  ulkeAdi: string;
  /** Kazanılmış damgada gösterilen bayrak görseli. */
  bayrakSrc?: string;
  kazanildi?: boolean;
  /** −6…+6 derece. Elle basılmış izlenimi verir; her ülke için sabit tutulur. */
  aci?: number;
}
export declare function Damga(props: DamgaProps): React.ReactElement;

export interface RozetProps extends React.HTMLAttributes<HTMLDivElement> {
  ikon: React.ReactNode;
  ad: string;
  aciklama: string;
  /** Kilitliyken gösterilecek ipucu metni; verilmezse `aciklama` kullanılır. */
  kilitliAciklama?: string;
  kazanildi?: boolean;
}
export declare function Rozet(props: RozetProps): React.ReactElement;

export interface SeviyeCubuguProps extends React.HTMLAttributes<HTMLElement> {
  seviye: number;
  /** Toplam XP. Seviye içi ilerleme `xp % hedefXp` ile hesaplanır. */
  xp: number;
  /** Seviye başına XP. Varsayılan 100. */
  hedefXp?: number;
  /** Seviye unvanı ("Usta Kâşif"). */
  unvan?: string;
  /** Dekoratif MRZ şeridi metni; ekran okuyuculardan gizlidir. */
  mrz?: string;
}
export declare function SeviyeCubugu(props: SeviyeCubuguProps): React.ReactElement;

export interface IpucuCipiProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Varsayılan "ipucu". "sure" belge yazı tipiyle sayaç gösterir. */
  tur?: "ipucu" | "sure" | "seri";
  ikon?: React.ReactNode;
  /** Kullanılmış joker: üstü çizili ve tıklanamaz. */
  kullanildi?: boolean;
  /** Yalnız tur="sure": son 10 saniyede kırmızı dolgu. */
  kritik?: boolean;
  children?: React.ReactNode;
}
export declare function IpucuCipi(props: IpucuCipiProps): React.ReactElement;

export interface NavOgesi {
  id: string;
  etiket: string;
  ikon: React.ReactNode;
  /** true ise bu öge ortadaki yükseltilmiş "Oyna" düğmesi olarak çizilir. */
  oyna?: boolean;
}
export interface AltNavigasyonProps extends React.HTMLAttributes<HTMLElement> {
  ogeler: NavOgesi[];
  /** Aktif ögenin id'si. */
  aktif?: string;
  /** "Oyna" düğmesinin dizini. Varsayılan: ortadaki öge. */
  oynaIndex?: number;
  /** nav için aria-label. Varsayılan "Ana gezinme". */
  etiket?: string;
}
export declare function AltNavigasyon(props: AltNavigasyonProps): React.ReactElement;
