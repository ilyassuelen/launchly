import { GraduationCap } from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type EducationEditModalProps = {
  open: boolean;

  school: string;

  degree: string;

  startDate?: string;

  endDate?: string;

  description?: string;

  onChangeSchool: (
    value: string,
  ) => void;

  onChangeDegree: (
    value: string,
  ) => void;

  onChangeStartDate: (
    value: string,
  ) => void;

  onChangeEndDate: (
    value: string,
  ) => void;

  onChangeDescription?: (
    value: string,
  ) => void;

  onClose: () => void;

  onSave: () => void;
};

export function EducationEditModal({
  open,

  school,

  degree,

  startDate,

  endDate,

  description,

  onChangeSchool,

  onChangeDegree,

  onChangeStartDate,

  onChangeEndDate,

  onChangeDescription,

  onClose,

  onSave,
}: EducationEditModalProps) {
  return (
    <ResumeEditModal
      open={open}
      title={
        school || "Edit Education"
      }
      subtitle="Manage education details, dates and description."
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
            icon={<GraduationCap className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            Save Changes
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label="School">
          <ResumeInput
            value={school}
            onChange={(e) =>
              onChangeSchool(
                e.target.value,
              )
            }
            placeholder="e.g. Masterschool"
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label="Degree">
          <ResumeInput
            value={degree}
            onChange={(e) =>
              onChangeDegree(
                e.target.value,
              )
            }
            placeholder="e.g. AI Engineering"
          />
        </ResumeFieldGroup>

        <div className="grid gap-5 md:grid-cols-2">

          <ResumeFieldGroup label="Start Date">
            <ResumeInput
              value={startDate || ""}
              onChange={(e) =>
                onChangeStartDate(
                  e.target.value,
                )
              }
              placeholder="e.g. Jan 2024"
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

        {onChangeDescription && (
          <ResumeFieldGroup label="Description">
            <ResumeTextarea
              value={description || ""}
              onChange={(e) =>
                onChangeDescription(
                  e.target.value,
                )
              }
              rows={5}
              placeholder="Add relevant education details, achievements or focus areas"
            />
          </ResumeFieldGroup>
        )}
      </div>
    </ResumeEditModal>
  );
}