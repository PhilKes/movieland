package com.phil.movieland.auth.jwt.entity;

import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

@Entity
@Table(name="ROLE")
public class Role {

    public enum RoleName {
        ROLE_USER,
        ROLE_ADMIN
    }

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(length=60)
    private RoleName name;

    public Role() {

    }

    public Role(RoleName name) {
        this.name=name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id=id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name=name;
    }
}