import { CommercialTemplate } from '../types/commercial';
import { DEFAULT_COMMERCIAL_TEMPLATES } from '../data/commercialDefaults';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const LOCAL_STORAGE_TEMPLATES_KEY = 'lamour_commercial_templates';
export const DELETED_TEMPLATES_KEY = 'lamour_deleted_template_ids';

export function getDeletedTemplateIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_TEMPLATES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
      }
    }
  } catch {}
  return [];
}

export function saveDeletedTemplateIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const unique = Array.from(new Set(ids.map((s) => String(s).trim().toLowerCase()).filter(Boolean)));
    localStorage.setItem(DELETED_TEMPLATES_KEY, JSON.stringify(unique));
  } catch {}
}

/**
 * Filter out deleted or obsolete templates (e.g. tree-of-love or explicitly deleted by admin)
 */
function isExcludedTemplate(t: Partial<CommercialTemplate>): boolean {
  const slug = (t.slug || '').toLowerCase().trim();
  const id = (t.id || '').toLowerCase().trim();
  const demoSlug = (t.demoSlug || '').toLowerCase().trim();
  const name = (t.name || '').toLowerCase();

  // Explicit hard-excluded legacy templates
  if (
    slug === 'tree-of-love' ||
    slug === 'tree-of-love-01' ||
    id === 'tpl-tree-of-love-01' ||
    id === 'tree-of-love' ||
    demoSlug === 'tree-of-love' ||
    name.includes('cây tình yêu') ||
    name.includes('the tree of love')
  ) {
    return true;
  }

  // Check against admin-deleted templates registry
  const deletedIds = getDeletedTemplateIds();
  if (
    (id && deletedIds.includes(id)) ||
    (slug && deletedIds.includes(slug)) ||
    (demoSlug && deletedIds.includes(demoSlug)) ||
    (slug && deletedIds.includes(`tpl-${slug}`))
  ) {
    return true;
  }

  return false;
}

/**
 * Deduplicates templates by canonical ID and slug to ensure each template appears exactly once.
 */
export function deduplicateTemplates(templates: CommercialTemplate[]): CommercialTemplate[] {
  const seen = new Set<string>();
  const result: CommercialTemplate[] = [];

  for (const t of templates) {
    if (!t) continue;
    const cleanId = String(t.id || '').toLowerCase().trim();
    const cleanSlug = String(t.slug || '').toLowerCase().trim();
    const cleanDemo = String(t.demoSlug || '').toLowerCase().trim();

    // Canonical primary identity
    const idKey = cleanId.replace(/^tpl-/, '');
    const slugKey = cleanSlug.replace(/^tpl-/, '');
    const primaryKey = slugKey || idKey || cleanDemo;

    if (!primaryKey) continue;

    if (seen.has(primaryKey)) {
      continue;
    }

    seen.add(primaryKey);
    if (cleanId) seen.add(cleanId);
    if (cleanSlug) seen.add(cleanSlug);
    if (cleanDemo) seen.add(cleanDemo);

    result.push(t);
  }

  return result;
}

/**
 * Normalizes and synchronizes any loaded template list (from localStorage or Firestore)
 * against the canonical definitions, guaranteeing that core models (Mẫu 3, Mẫu 2, Mẫu 1)
 * are always active, up-to-date, and presented at the top of the collection.
 */
export function normalizeTemplatesList(rawList: CommercialTemplate[]): CommercialTemplate[] {
  // 0. Remove any excluded or obsolete templates and deduplicate
  const cleanRaw = deduplicateTemplates(rawList.filter((t) => !isExcludedTemplate(t)));
  const list = [...cleanRaw];

  // 1. Ensure non-deleted default templates are present and updated with canonical metadata
  for (const def of DEFAULT_COMMERCIAL_TEMPLATES) {
    if (isExcludedTemplate(def)) continue;
    const existingIndex = list.findIndex(
      (t) =>
        t.slug === def.slug ||
        t.id === def.id ||
        (def.slug && t.id === `tpl-${def.slug}`) ||
        (t.slug && def.id === `tpl-${t.slug}`) ||
        (def.demoSlug && t.demoSlug === def.demoSlug)
    );

    const isCoreModel =
      def.slug === 'traditional-vietnamese' ||
      def.slug === 'floral-romance' ||
      def.slug === 'vietnamese-modern-luxury';

    if (existingIndex === -1) {
      list.push({ ...def, active: def.active !== undefined ? def.active : true, isFeatured: isCoreModel ? true : def.isFeatured });
    } else {
      const existing = list[existingIndex];
      list[existingIndex] = {
        ...def,
        ...existing,
        // Crucial: Admin-configured package, price, plan, active status must be preserved
        packageId: existing.packageId !== undefined ? existing.packageId : def.packageId,
        packageName: existing.packageName !== undefined ? existing.packageName : def.packageName,
        requiredPlan: existing.requiredPlan !== undefined ? existing.requiredPlan : def.requiredPlan,
        price: existing.price !== undefined ? existing.price : def.price,
        active: existing.active !== undefined ? existing.active : def.active !== undefined ? def.active : true,
        isFeatured: existing.isFeatured !== undefined ? existing.isFeatured : def.isFeatured,
      };
    }
  }

  // 2. Strict prioritization: Mẫu 3 -> Mẫu 2 -> Mẫu 1 at the top
  const prioritizedSlugs = ['traditional-vietnamese', 'floral-romance', 'vietnamese-modern-luxury'];
  const topTemplates: CommercialTemplate[] = [];

  for (const slug of prioritizedSlugs) {
    const idx = list.findIndex((t) => t.slug === slug || t.id === `tpl-${slug}` || t.id === slug);
    if (idx !== -1) {
      const [item] = list.splice(idx, 1);
      topTemplates.push({
        ...item,
        packageId: item.packageId,
        packageName: item.packageName,
        requiredPlan: item.requiredPlan,
        price: item.price,
        active: item.active !== undefined ? item.active : true,
        isFeatured: item.isFeatured !== undefined ? item.isFeatured : true,
      });
    } else {
      const def = DEFAULT_COMMERCIAL_TEMPLATES.find((t) => t.slug === slug);
      if (def && !isExcludedTemplate(def)) {
        topTemplates.push({
          ...def,
          active: def.active !== undefined ? def.active : true,
          isFeatured: true,
        });
      }
    }
  }

  // Deduplicate combined top and remaining templates
  return deduplicateTemplates([...topTemplates, ...list]);
}

export function getCommercialTemplatesSync(): CommercialTemplate[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored)) {
        const normalized = normalizeTemplatesList(stored);
        localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch {}

  const normalized = normalizeTemplatesList(DEFAULT_COMMERCIAL_TEMPLATES);
  try {
    localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(normalized));
  } catch {}
  return normalized;
}

export async function getCommercialTemplates(): Promise<CommercialTemplate[]> {
  if (isFirebaseConfigured && db) {
    try {
      // Purge obsolete template from Firestore if it exists
      try {
        await deleteDoc(doc(db, 'templates', 'tpl-tree-of-love-01'));
        await deleteDoc(doc(db, 'templates', 'tree-of-love'));
      } catch {
        // ignore
      }

      const snap = await getDocs(collection(db, 'templates'));
      const list: CommercialTemplate[] = [];
      const duplicateDocIdsToDelete: string[] = [];

      snap.forEach((d) => {
        const data = d.data() as CommercialTemplate;
        if (!isExcludedTemplate(data)) {
          // If the Firestore document ID is the slug (e.g. 'celestial-royale') rather than canonical tpl.id ('tpl-celestial-royale'),
          // mark it for background cleanup so Firestore doesn't hold duplicate documents!
          if (data.id && d.id !== data.id && d.id === data.slug) {
            duplicateDocIdsToDelete.push(d.id);
          }
          list.push(data);
        }
      });

      if (duplicateDocIdsToDelete.length > 0) {
        duplicateDocIdsToDelete.forEach((dupId) => {
          deleteDoc(doc(db, 'templates', dupId)).catch(() => {});
        });
      }

      if (list.length > 0) {
        const normalized = normalizeTemplatesList(list);
        localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(normalized));
        return normalized;
      }
    } catch (err) {
      console.warn('Could not load templates from Firestore, using defaults:', err);
    }
  }

  return getCommercialTemplatesSync();
}

export function saveCommercialTemplates(templates: CommercialTemplate[]): void {
  const uniqueTemplates = deduplicateTemplates(templates);

  try {
    localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(uniqueTemplates));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lamour_commercial_templates_updated', { detail: uniqueTemplates }));
      try {
        const bc = new BroadcastChannel('lamour_wedding_sync');
        bc.postMessage({ type: 'TEMPLATES_UPDATED', templates: uniqueTemplates });
        setTimeout(() => {
          try { bc.close(); } catch {}
        }, 500);
      } catch {}
    }
  } catch (err) {
    console.error('Error saving templates to localStorage:', err);
  }

  // Sync to Firestore if available so changes persist across reloads
  if (isFirebaseConfigured && db) {
    try {
      uniqueTemplates.forEach((tpl) => {
        const docId = tpl.id || (tpl.slug ? `tpl-${tpl.slug}` : undefined);
        if (docId) {
          const sanitized = JSON.parse(JSON.stringify({ ...tpl, id: docId }));
          setDoc(doc(db, 'templates', docId), sanitized, { merge: true }).catch(() => {});
          // If a duplicate doc was previously saved under tpl.slug (when tpl.slug !== docId), delete it!
          if (tpl.slug && tpl.slug !== docId) {
            deleteDoc(doc(db, 'templates', tpl.slug)).catch(() => {});
          }
        }
      });
    } catch {}
  }
}

export function createCommercialTemplate(
  data: Omit<CommercialTemplate, 'id'> & { id?: string }
): CommercialTemplate {
  const current = getCommercialTemplatesSync();
  const newId = data.id || `tpl-${Date.now()}`;
  const newTemplate: CommercialTemplate = {
    ...data,
    id: newId,
  };
  const updated = [newTemplate, ...current];
  saveCommercialTemplates(updated);
  return newTemplate;
}

export function updateCommercialTemplate(
  id: string,
  updates: Partial<CommercialTemplate>
): CommercialTemplate | null {
  const current = getCommercialTemplatesSync();
  const index = current.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveCommercialTemplates(current);
  return updatedItem;
}

export async function deleteCommercialTemplateAsync(id: string): Promise<boolean> {
  const current = getCommercialTemplatesSync();
  const target = current.find((t) => t.id === id || t.slug === id);
  if (!target) return false;

  // 1. Record identifiers in deleted templates registry so they will never be resurrected
  const deletedIds = getDeletedTemplateIds();
  const idsToAdd = [
    target.id,
    target.slug,
    target.demoSlug,
    `tpl-${target.slug}`,
  ].filter(Boolean).map((s) => s.toLowerCase().trim());
  saveDeletedTemplateIds([...deletedIds, ...idsToAdd]);

  // 2. Remove from local list & persist
  const filtered = current.filter((t) => t.id !== target.id && t.slug !== target.slug);
  saveCommercialTemplates(filtered);

  // 3. Delete from Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const docIds = Array.from(new Set(idsToAdd));
      for (const docId of docIds) {
        try {
          await deleteDoc(doc(db, 'templates', docId));
        } catch {}
      }
    } catch (err) {
      console.warn('Firestore deleteCommercialTemplate error:', err);
    }
  }

  return true;
}

export function deleteCommercialTemplate(id: string): boolean {
  deleteCommercialTemplateAsync(id);
  return true;
}

export function toggleTemplateActiveStatus(id: string): boolean {
  const current = getCommercialTemplatesSync();
  const item = current.find((t) => t.id === id);
  if (!item) return false;
  item.active = !item.active;
  saveCommercialTemplates(current);
  return item.active;
}

export function toggleTemplateFeaturedStatus(id: string): boolean {
  const current = getCommercialTemplatesSync();
  const item = current.find((t) => t.id === id);
  if (!item) return false;
  item.isFeatured = !item.isFeatured;
  saveCommercialTemplates(current);
  return !!item.isFeatured;
}

export function resetCommercialTemplatesToDefault(): CommercialTemplate[] {
  saveDeletedTemplateIds([]);
  saveCommercialTemplates(DEFAULT_COMMERCIAL_TEMPLATES);
  return DEFAULT_COMMERCIAL_TEMPLATES;
}

export async function getTemplateBySlug(slug: string): Promise<CommercialTemplate | undefined> {
  const templates = await getCommercialTemplates();
  return templates.find((t) => t.slug === slug || t.demoSlug === slug);
}
