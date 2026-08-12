package kr.go.support.subsidy.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass
public abstract class BaseEntity extends BaseTimeEntity {

    private Instant deletedAt;

    public void delete() {
        this.deletedAt = Instant.now();
    }

    /*
    public void restore() {this.deletedAt = null;}
    */

    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}