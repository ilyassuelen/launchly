import {
  BriefcaseBusiness,
  Plus,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type ExperienceEditModalProps = {
  open: boolean;

  company: string;

  role: string;

  startDate?: string;

  endDate?: string;

  summary?: string;

  bullets: string[];

  onChangeCompany: (
    value: string,
  ) => void;

  onChangeRole: (
    value: string,
  ) => void;

  onChangeStartDate: (
    value: string,
  ) => void;

  onChangeEndDate: (
    value: string,
  ) => void;

  onChangeSummary?: (
    value: string,
  ) => void;

  onChangeBullet: (
    index: number,
    value: string,
  ) => void;

  onAddBullet: () => void;

  onClose: () => void;

  onSave: () => void;
};

export function ExperienceEditModal({
  open,

  company,

  role,

  startDate,

  endDate,

  summary,

  bullets,

  onChangeCompany,

  onChangeRole,

  onChangeStartDate,

  onChangeEndDate,

  onChangeSummary,

  onChangeBullet,

  onAddBullet,

  onClose,

  onSave,
}: ExperienceEditModalProps) {
  return (
    <ResumeEditModal
      open={open}
      title={
        role || "Edit Experience"
      }
      subtitle="Manage company details, dates and impact bullets."
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <ResumeActionButton
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </ResumeActionButton>

          <ResumeActionButton
            icon={<BriefcaseBusiness className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            Save Changes
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label="Company">
          <ResumeInput
            value={company}
            onChange={(e) =>
              onChangeCompany(
                e.target.value,
              )
            }
            placeholder="e.g. OpenAI"
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label="Role">
          <ResumeInput
            value={role}
            onChange={(e) =>
              onChangeRole(
                e.target.value,
              )
            }
            placeholder="e.g. AI Engineer"
          />
        </ResumeFieldGroup>

        <div className="grid gap-4 md:grid-cols-2">

          <ResumeFieldGroup label="Start Date">
            <ResumeInput
              value={startDate || ""}
              onChange={(e) =>
                onChangeStartDate(
                  e.target.value,
                )
              }
              placeholder="e.g. Jan 2025"
            />
          </ResumeFieldGroup>

          <ResumeFieldGroup label="End Date">
            <ResumeInput
              value={endDate || ""}
              onChange={(e) =>
                onChangeEndDate(
                  e.target.value,
                )
              }
              placeholder="e.g. Present"
            />
          </ResumeFieldGroup>
        </div>

        {onChangeSummary && (
          <ResumeFieldGroup label="Summary">
            <ResumeTextarea
              value={summary || ""}
              onChange={(e) =>
                onChangeSummary(
                  e.target.value,
                )
              }
              rows={5}
              placeholder="Write a short summary about your responsibilities and impact"
            />
          </ResumeFieldGroup>
        )}

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Impact Bullets
            </div>

            <ResumeActionButton
              icon={<Plus className="size-4" />}
              variant="primary"
              onClick={onAddBullet}
            >
              Add Bullet
            </ResumeActionButton>
          </div>

          <div className="space-y-5">
            {bullets.map(
              (bullet, index) => (
                <ResumeFieldGroup
                  key={index}
                  label={`Bullet ${
                    index + 1
                  }`}
                >
                  <ResumeTextarea
                    value={bullet}
                    onChange={(e) =>
                      onChangeBullet(
                        index,
                        e.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Describe measurable impact, ownership or technical achievements"
                  />
                </ResumeFieldGroup>
              ),
            )}
          </div>
        </div>
      </div>
    </ResumeEditModal>
  );
}